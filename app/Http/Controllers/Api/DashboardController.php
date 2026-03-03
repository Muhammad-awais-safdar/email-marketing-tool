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
        $stats = [
            'campaigns' => Campaign::count(),
            'subscribers' => Subscriber::count(),
            'sent' => Campaign::where('status', 'sent')->count(),
            'rate' => 85, // We can mock a "healthy" default or calculate based on theoretical data
        ];

        $recentCampaigns = Campaign::with(['emailList' => function($query) {
            $query->withCount('subscribers');
        }])
            ->latest()
            ->take(5)
            ->get();

        return $this->successResponse([
            'stats' => $stats,
            'recentCampaigns' => $recentCampaigns,
        ]);
    }
}
