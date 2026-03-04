<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WhatsappCampaign;
use App\Models\WhatsappList;
use App\Models\WhatsappTemplate;
use App\Traits\LogsActivity;

class WhatsappCampaignController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $campaigns = auth()->user()->whatsappCampaigns()
            ->with(['list' => function($query) {
                $query->withCount('contacts');
            }, 'template'])
            ->latest()
            ->paginate(10);

        return $this->successResponse($campaigns);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'whatsapp_list_id' => 'required|exists:whatsapp_lists,id',
            'whatsapp_template_id' => 'required|exists:whatsapp_templates,id',
            'scheduled_at' => 'nullable|date',
            'send_delay' => 'sometimes|integer|min:0|max:3600',
        ]);

        // Authorize List and Template
        if (!$this->isOwner(WhatsappList::find($validated['whatsapp_list_id'])) ||
            !$this->isOwner(WhatsappTemplate::find($validated['whatsapp_template_id']))) {
            abort(403, 'Unauthorized action.');
        }

        $campaign = auth()->user()->whatsappCampaigns()->create($validated);
        $this->logActivity('WhatsApp Campaign Created', "Created WhatsApp campaign '{$campaign->name}'");
        
        return $this->successResponse($campaign, 'WhatsApp campaign created successfully', 201);
    }

    public function show(WhatsappCampaign $whatsappCampaign)
    {
        $this->authorizeOwner($whatsappCampaign);
        return $this->successResponse($whatsappCampaign->load(['list', 'template']));
    }

    public function update(Request $request, WhatsappCampaign $whatsappCampaign)
    {
        $this->authorizeOwner($whatsappCampaign);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'whatsapp_list_id' => 'required|exists:whatsapp_lists,id',
            'whatsapp_template_id' => 'required|exists:whatsapp_templates,id',
            'status' => 'sometimes|in:draft,scheduled,sending,completed,failed',
            'scheduled_at' => 'nullable|date',
            'send_delay' => 'sometimes|integer|min:0|max:3600',
        ]);

        // Authorize new List and Template
        if (!$this->isOwner(WhatsappList::find($validated['whatsapp_list_id'])) ||
            !$this->isOwner(WhatsappTemplate::find($validated['whatsapp_template_id']))) {
            abort(403, 'Unauthorized action.');
        }

        $whatsappCampaign->update($validated);
        $this->logActivity('WhatsApp Campaign Updated', "Updated WhatsApp campaign '{$whatsappCampaign->name}'");
        
        return $this->successResponse($whatsappCampaign, 'WhatsApp campaign updated successfully');
    }

    public function destroy(WhatsappCampaign $whatsappCampaign)
    {
        $this->authorizeOwner($whatsappCampaign);
        
        $name = $whatsappCampaign->name;
        $whatsappCampaign->delete();
        $this->logActivity('WhatsApp Campaign Deleted', "Deleted WhatsApp campaign '{$name}'");
        
        return $this->successResponse(null, 'WhatsApp campaign deleted successfully');
    }

    public function send(WhatsappCampaign $whatsappCampaign)
    {
        $this->authorizeOwner($whatsappCampaign);

        if ($whatsappCampaign->status === 'completed') {
            return $this->errorResponse('Campaign already completed', 400);
        }

        \App\Jobs\SendWhatsappCampaign::dispatch($whatsappCampaign);
        
        $whatsappCampaign->update(['status' => 'sending']);
        $this->logActivity('WhatsApp Campaign Sent', "Queued WhatsApp campaign '{$whatsappCampaign->name}' for sending.");
        
        return $this->successResponse(null, 'WhatsApp campaign queued for sending');
    }

    public function duplicate(WhatsappCampaign $whatsappCampaign)
    {
        $this->authorizeOwner($whatsappCampaign);

        $newCampaign = $whatsappCampaign->replicate();
        $newCampaign->name = $whatsappCampaign->name . ' (Copy)';
        $newCampaign->status = 'draft';
        $newCampaign->save();

        $this->logActivity('WhatsApp Campaign Duplicated', "Duplicated WhatsApp campaign '{$whatsappCampaign->name}'.");

        return $this->successResponse($newCampaign, 'Campaign duplicated successfully');
    }

    public function stats(WhatsappCampaign $whatsappCampaign)
    {
        $this->authorizeOwner($whatsappCampaign);

        $stats = [
            'total' => $whatsappCampaign->list->contacts()->count(),
            'sent' => $whatsappCampaign->deliveries()->where('status', 'sent')->count(),
            'failed' => $whatsappCampaign->deliveries()->where('status', 'failed')->count(),
            'logs' => $whatsappCampaign->deliveries()
                ->with('contact')
                ->latest()
                ->get()
                ->map(function ($delivery) {
                    return [
                        'id' => $delivery->id,
                        'contact_name' => $delivery->contact->name,
                        'phone_number' => $delivery->contact->phone_number,
                        'status' => $delivery->status,
                        'error' => $delivery->error_message,
                        'sent_at' => $delivery->sent_at,
                    ];
                }),
        ];

        return $this->successResponse($stats);
    }

    private function isOwner($model)
    {
        return $model && $model->user_id === auth()->id();
    }

    private function authorizeOwner(WhatsappCampaign $campaign)
    {
        if ($campaign->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
