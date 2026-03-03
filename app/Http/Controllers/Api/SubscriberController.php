<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Subscriber;

class SubscriberController extends Controller
{
    public function index()
    {
        $subscribers = Subscriber::with('emailList')->paginate(20);
        return $this->successResponse($subscribers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscribers,email',
            'name' => 'nullable|string|max:255',
            'email_list_id' => 'required|exists:email_lists,id',
        ]);

        $subscriber = Subscriber::create($validated);
        return $this->successResponse($subscriber, 'Subscriber created successfully', 201);
    }

    public function show(Subscriber $subscriber)
    {
        return $this->successResponse($subscriber->load('emailList'));
    }

    public function update(Request $request, Subscriber $subscriber)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:subscribers,email,' . $subscriber->id,
            'name' => 'nullable|string|max:255',
            'status' => 'required|in:active,unsubscribed',
            'email_list_id' => 'required|exists:email_lists,id',
        ]);

        $subscriber->update($validated);

        return $this->successResponse($subscriber, 'Subscriber updated successfully');
    }

    public function destroy(Subscriber $subscriber)
    {
        $subscriber->delete();

        return $this->successResponse(null, 'Subscriber deleted successfully');
    }
}
