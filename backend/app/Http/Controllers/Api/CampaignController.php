<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Campaign;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::with('emailList')->latest()->paginate(10);
        return $this->successResponse($campaigns);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'email_list_id' => 'nullable|exists:email_lists,id',
            'scheduled_at' => 'nullable|date',
        ]);

        $campaign = Campaign::create($validated);
        return $this->successResponse($campaign, 'Campaign created successfully', 201);
    }

    public function show(Campaign $campaign)
    {
        return $this->successResponse($campaign->load('emailList'));
    }

    public function update(Request $request, Campaign $campaign)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'email_list_id' => 'nullable|exists:email_lists,id',
            'status' => 'required|in:draft,sent,scheduled',
            'scheduled_at' => 'nullable|date',
        ]);

        $campaign->update($validated);

        return $this->successResponse($campaign, 'Campaign updated successfully');
    }

    public function destroy(Campaign $campaign)
    {
        $campaign->delete();

        return $this->successResponse(null, 'Campaign deleted successfully');
    }

    public function send(Campaign $campaign)
    {
        if ($campaign->status === 'sent') {
            return $this->errorResponse('Campaign already sent', 400);
        }

        \App\Jobs\SendEmailCampaign::dispatch($campaign);

        return $this->successResponse(null, 'Campaign queued for sending');
    }
}
