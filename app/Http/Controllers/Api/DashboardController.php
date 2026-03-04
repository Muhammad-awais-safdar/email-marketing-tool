<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Subscriber;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $emailStats = [
            'campaigns' => Campaign::count(),
            'subscribers' => Subscriber::count(),
            'sent' => Campaign::where('status', 'sent')->count(),
            'rate' => 85,
        ];

        $whatsappStats = [
            'campaigns' => \App\Models\WhatsappCampaign::count(),
            'contacts' => \App\Models\WhatsappContact::count(),
            'sent' => \App\Models\WhatsappCampaign::where('status', 'completed')->count(),
        ];

        $recentEmailCampaigns = Campaign::with(['emailList' => function($query) {
            $query->withCount('subscribers');
        }])
            ->latest()
            ->take(5)
            ->get();

        $recentWhatsappCampaigns = \App\Models\WhatsappCampaign::with(['list' => function($query) {
            $query->withCount('contacts');
        }])
            ->latest()
            ->take(5)
            ->get();

        return $this->successResponse([
            'email_stats' => $emailStats,
            'whatsapp_stats' => $whatsappStats,
            'recent_email_campaigns' => $recentEmailCampaigns,
            'recent_whatsapp_campaigns' => $recentWhatsappCampaigns,
        ]);
    }
}
