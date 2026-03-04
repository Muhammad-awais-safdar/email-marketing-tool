<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WhatsappContact;
use App\Models\WhatsappList;
use App\Traits\LogsActivity;

class WhatsappContactController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $contacts = WhatsappContact::whereIn('whatsapp_list_id', function ($query) {
            $query->select('id')->from('whatsapp_lists')->where('user_id', auth()->id());
        })->with('list')->paginate(20);

        return $this->successResponse($contacts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone_number' => 'required|string|max:20',
            'name' => 'nullable|string|max:255',
            'whatsapp_list_id' => 'required|exists:whatsapp_lists,id',
        ]);

        $list = WhatsappList::findOrFail($validated['whatsapp_list_id']);
        if ($list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $contact = WhatsappContact::create($validated);
        $this->logActivity('WhatsApp Contact Added', "Added WhatsApp contact '{$contact->phone_number}' to list '{$list->name}'");
        
        return $this->successResponse($contact, 'WhatsApp contact created successfully', 201);
    }

    public function show(WhatsappContact $whatsappContact)
    {
        $this->authorizeOwner($whatsappContact);
        return $this->successResponse($whatsappContact->load('list'));
    }

    public function update(Request $request, WhatsappContact $whatsappContact)
    {
        $this->authorizeOwner($whatsappContact);

        $validated = $request->validate([
            'phone_number' => 'required|string|max:20',
            'name' => 'nullable|string|max:255',
            'whatsapp_list_id' => 'required|exists:whatsapp_lists,id',
        ]);

        $list = WhatsappList::findOrFail($validated['whatsapp_list_id']);
        if ($list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $whatsappContact->update($validated);
        $this->logActivity('WhatsApp Contact Updated', "Updated WhatsApp contact '{$whatsappContact->phone_number}'");
        
        return $this->successResponse($whatsappContact, 'WhatsApp contact updated successfully');
    }

    public function destroy(WhatsappContact $whatsappContact)
    {
        $this->authorizeOwner($whatsappContact);
        
        $phone = $whatsappContact->phone_number;
        $whatsappContact->delete();
        $this->logActivity('WhatsApp Contact Deleted', "Deleted WhatsApp contact '{$phone}'");
        
        return $this->successResponse(null, 'WhatsApp contact deleted successfully');
    }

    private function authorizeOwner(WhatsappContact $contact)
    {
        if ($contact->list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
