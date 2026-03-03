<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait LogsActivity
{
    /**
     * Record an activity log.
     *
     * @param string $action
     * @param string|null $description
     * @return void
     */
    protected function logActivity(string $action, string $description = null)
    {
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'description' => $description,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);

        // Also log to the daily laravel.log file for redundancy with full context
        \Illuminate\Support\Facades\Log::info("Activity Logged: [{$action}]", [
            'user_id' => Auth::id() ?? 'Guest',
            'ip' => Request::ip(),
            'url' => Request::fullUrl(),
            'user_agent' => Request::userAgent(),
            'action' => $action,
            'description' => $description,
        ]);
    }
}
