<?php

namespace App\Helpers;

use App\Models\Setting;
use Illuminate\Support\Facades\Config;

class MailConfigHelper
{
    public static function apply($userId = null)
    {
        $userId = $userId ?: auth()->id();
        if (!$userId) return;

        $settings = Setting::where('user_id', $userId)->get()->pluck('value', 'key')->toArray();

        // Map settings to Laravel mailer config
        $config = [
            'transport' => $settings['mail_driver'] ?? config('mail.default'),
            'host' => $settings['mail_host'] ?? config('mail.mailers.smtp.host'),
            'port' => $settings['mail_host'] ? (int)($settings['mail_port'] ?? 587) : config('mail.mailers.smtp.port'),
            'encryption' => ($settings['mail_encryption'] ?? 'tls') === 'none' ? null : ($settings['mail_encryption'] ?? 'tls'),
            'username' => $settings['mail_username'] ?? config('mail.mailers.smtp.username'),
            'password' => $settings['mail_password'] ?? config('mail.mailers.smtp.password'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN'),
        ];

        // Update SMTP mailer
        Config::set('mail.mailers.smtp', array_merge(config('mail.mailers.smtp'), $config));

        // Update default from address
        if (isset($settings['mail_from_address'])) {
            Config::set('mail.from.address', $settings['mail_from_address']);
        }
        if (isset($settings['mail_from_name'])) {
            Config::set('mail.from.name', $settings['mail_from_name']);
        }

    }
}
