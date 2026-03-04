<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WhatsappCampaign;
use App\Traits\LogsActivity;

class WhatsappStatsController extends Controller
{
    use LogsActivity;

    public function show(WhatsappCampaign $whatsappCampaign)
    {
        $this->authorizeOwner($whatsappCampaign);

        $deliveries = $whatsappCampaign->deliveries()->with('contact')->latest()->get();
        
        $stats = [
            'total' => $deliveries->count(),
            'sent' => $deliveries->where('status', 'sent')->count(),
            'failed' => $deliveries->where('status', 'failed')->count(),
            'logs' => $deliveries->map(function($d) {
                return [
                    'id' => $d->id,
                    'contact_name' => $d->contact->name,
                    'phone_number' => $d->contact->phone_number,
                    'status' => $d->status,
                    'error' => $d->error_message,
                    'sent_at' => $d->sent_at,
                ];
            }),
        ];

        return response()->json([
            'Success' => true,
            'Result' => $stats,
        ]);
    }

    private function authorizeOwner(WhatsappCampaign $campaign)
    {
        if ($campaign->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
