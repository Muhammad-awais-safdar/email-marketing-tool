<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\EmailList;

use App\Traits\LogsActivity;

class EmailListController extends Controller
{
    use LogsActivity;
    public function index()
    {
        return $this->successResponse(EmailList::withCount('subscribers')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $emailList = EmailList::create($validated);
        $this->logActivity('List Created', "Created email list '{$emailList->name}'");
        return $this->successResponse($emailList, 'List created successfully', 201);
    }

    public function show(EmailList $emailList)
    {
        return $this->successResponse($emailList);
    }

    public function update(Request $request, EmailList $emailList)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $emailList->update($validated);
        $this->logActivity('List Updated', "Updated email list '{$emailList->name}'");
        return $this->successResponse($emailList, 'List updated successfully');
    }

    public function destroy(EmailList $emailList)
    {
        $name = $emailList->name;
        $emailList->delete();
        $this->logActivity('List Deleted', "Deleted email list '{$name}'");
        return $this->successResponse(null, 'List deleted successfully');
    }
}
