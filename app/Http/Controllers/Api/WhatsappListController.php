<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WhatsappList;
use App\Traits\LogsActivity;

class WhatsappListController extends Controller
{
    use LogsActivity;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->successResponse(
            auth()->user()->whatsappLists()->withCount('contacts')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $list = auth()->user()->whatsappLists()->create($validated);
        
        $this->logActivity('WhatsApp List Created', "Created WhatsApp list '{$list->name}'");
        
        return $this->successResponse($list, 'WhatsApp list created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(WhatsappList $whatsappList)
    {
        $this->authorizeOwner($whatsappList);
        return $this->successResponse($whatsappList->loadCount('contacts'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WhatsappList $whatsappList)
    {
        $this->authorizeOwner($whatsappList);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $whatsappList->update($validated);
        
        $this->logActivity('WhatsApp List Updated', "Updated WhatsApp list '{$whatsappList->name}'");
        
        return $this->successResponse($whatsappList, 'WhatsApp list updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WhatsappList $whatsappList)
    {
        $this->authorizeOwner($whatsappList);
        
        $name = $whatsappList->name;
        $whatsappList->delete();
        
        $this->logActivity('WhatsApp List Deleted', "Deleted WhatsApp list '{$name}'");
        
        return $this->successResponse(null, 'WhatsApp list deleted successfully');
    }

    private function authorizeOwner(WhatsappList $list)
    {
        if ($list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
