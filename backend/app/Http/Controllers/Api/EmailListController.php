<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\EmailList;

class EmailListController extends Controller
{
    public function index()
    {
        return $this->successResponse(EmailList::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $emailList = EmailList::create($validated);
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

        return $this->successResponse($emailList, 'List updated successfully');
    }

    public function destroy(EmailList $emailList)
    {
        $emailList->delete();

        return $this->successResponse(null, 'List deleted successfully');
    }
}
