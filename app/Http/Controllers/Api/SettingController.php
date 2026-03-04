<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;
use App\Helpers\MailConfigHelper;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::where('user_id', auth()->id())->get()->pluck('value', 'key');
        return $this->successResponse($settings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            Setting::updateOrCreate(
                ['user_id' => auth()->id(), 'key' => $key],
                ['value' => $value]
            );
        }

        return $this->successResponse(
            Setting::where('user_id', auth()->id())->get()->pluck('value', 'key'),
            'Settings updated successfully'
        );
    }

    public function testConnection(Request $request)
    {
        try {
            // Apply settings from the request temporarily
            $settings = $request->input('settings', []);
            
            // Map settings to Laravel mailer config
            $config = [
                'transport' => $settings['mail_driver'] ?? 'smtp',
                'host' => $settings['mail_host'] ?? '',
                'port' => (int)($settings['mail_port'] ?? 587),
                'encryption' => ($settings['mail_encryption'] ?? 'tls') === 'none' ? null : ($settings['mail_encryption'] ?? 'tls'),
                'username' => $settings['mail_username'] ?? '',
                'password' => $settings['mail_password'] ?? '',
            ];

            \Illuminate\Support\Facades\Config::set('mail.mailers.smtp_test', array_merge(config('mail.mailers.smtp'), $config));
            
            Mail::mailer('smtp_test')->raw('SMTP Connection test successful!', function ($message) use ($settings) {
                $message->to($settings['mail_from_address'] ?? 'test@example.com')
                    ->subject('SMTP Test Connection');
            });

            return $this->successResponse(null, 'SMTP connection test successful!');
        } catch (\Exception $e) {
            return $this->errorResponse('SMTP connection failed: ' . $e->getMessage(), 500);
        }
    }
}
