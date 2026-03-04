<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WhatsappTemplate;
use App\Traits\LogsActivity;

class WhatsappTemplateController extends Controller
{
    use LogsActivity;

    public function index()
    {
        return $this->successResponse(auth()->user()->whatsappTemplates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'metadata' => 'nullable|array',
        ]);

        $template = auth()->user()->whatsappTemplates()->create($validated);
        $this->logActivity('WhatsApp Template Created', "Created WhatsApp template '{$template->name}'");
        
        return $this->successResponse($template, 'WhatsApp template created successfully', 201);
    }

    public function show(WhatsappTemplate $whatsappTemplate)
    {
        $this->authorizeOwner($whatsappTemplate);
        return $this->successResponse($whatsappTemplate);
    }

    public function update(Request $request, WhatsappTemplate $whatsappTemplate)
    {
        $this->authorizeOwner($whatsappTemplate);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'metadata' => 'nullable|array',
        ]);

        $whatsappTemplate->update($validated);
        $this->logActivity('WhatsApp Template Updated', "Updated WhatsApp template '{$whatsappTemplate->name}'");
        
        return $this->successResponse($whatsappTemplate, 'WhatsApp template updated successfully');
    }

    public function destroy(WhatsappTemplate $whatsappTemplate)
    {
        $this->authorizeOwner($whatsappTemplate);
        
        $name = $whatsappTemplate->name;
        $whatsappTemplate->delete();
        $this->logActivity('WhatsApp Template Deleted', "Deleted WhatsApp template '{$name}'");
        
        return $this->successResponse(null, 'WhatsApp template deleted successfully');
    }

    private function authorizeOwner(WhatsappTemplate $template)
    {
        if ($template->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
