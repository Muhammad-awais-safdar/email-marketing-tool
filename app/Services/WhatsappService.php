<?php

namespace App\Services;

use App\Gateways\Contracts\WhatsappGatewayInterface;
use App\Models\WhatsappCampaign;
use App\Models\WhatsappContact;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WhatsappService
{
    protected function getGateway(array $config): WhatsappGatewayInterface
    {
        $provider = $config['provider'] ?? 'wa_gateway';

        return match ($provider) {
            'meta' => new \App\Gateways\Whatsapp\MetaCloudGateway(),
            'twilio' => new \App\Gateways\Whatsapp\TwilioGateway(),
            default => new \App\Gateways\Whatsapp\CustomGateway(),
        };
    }

    /**
     * Send a WhatsApp message to a specific contact for a campaign.
     * Uses the authenticated user's settings or the campaign owner's settings.
     */
    public function sendMessage(WhatsappContact $contact, string $content, ?\App\Models\User $user = null): array
    {
        $user = $user ?? auth()->user();
        
        if (!$user) {
            throw new \Exception("Cannot send WhatsApp message: User not authenticated or provided.");
        }

        $settings = \App\Models\Setting::where('user_id', $user->id)
            ->where('key', 'like', 'whatsapp_%')
            ->pluck('value', 'key')
            ->toArray();
        
        $config = [
            'provider' => $settings['whatsapp_provider'] ?? 'wa_gateway',
            'api_key' => $settings['whatsapp_api_key'] ?? '',
            'instance_id' => $settings['whatsapp_instance_id'] ?? '',
            'webhook_url' => $settings['whatsapp_webhook_url'] ?? '',
        ];

        // Ensure we pass the phone property formatted correctly depending on the gateway
        $gateway = $this->getGateway($config);

        try {
            return $gateway->send($contact->phone_number, $content, $config);
        } catch (\Exception $e) {
            Log::error("WhatsappService Error sending to {$contact->phone_number}: " . $e->getMessage());
            return [
                'success' => false,
                'message_id' => null,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Replace placeholders in the template content.
     */
    public function formatMessage(string $content, WhatsappContact $contact)
    {
        $placeholders = [
            '{{name}}' => $contact->name ?: 'Customer',
            '{{phone}}' => $contact->phone_number,
        ];

        return str_replace(array_keys($placeholders), array_values($placeholders), $content);
    }
}
