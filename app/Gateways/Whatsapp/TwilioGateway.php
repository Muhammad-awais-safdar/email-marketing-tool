<?php

namespace App\Gateways\Whatsapp;

use App\Gateways\Contracts\WhatsappGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TwilioGateway implements WhatsappGatewayInterface
{
    public function send(string $to, string $message, array $config): array
    {
        $sid = $config['instance_id'] ?? ''; // For Twilio, instance_id stores Account SID
        $token = $config['api_key'] ?? '';    // Auth Token
        $fromNumber = $config['from_number'] ?? ''; // Optional: Store in webhook_url or a new DB field if needed

        if (empty($sid) || empty($token)) {
            throw new \Exception("Twilio requires Account SID (instance_id) and Auth Token (api_key).");
        }

        // Twilio expects 'whatsapp:+1234567890' format
        $toFormatted = "whatsapp:" . (str_starts_with($to, '+') ? $to : '+' . $to);
        $fromFormatted = "whatsapp:" . (str_starts_with($fromNumber, '+') ? $fromNumber : '+' . $fromNumber);

        $url = "https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json";

        try {
            $response = Http::asForm()->withBasicAuth($sid, $token)->post($url, [
                'To' => $toFormatted,
                'From' => $fromFormatted,
                'Body' => $message,
            ]);

            Log::debug("Twilio WhatsApp Response", ['status' => $response->status(), 'body' => $response->json()]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'message_id' => $data['sid'] ?? 'tw_' . uniqid(),
                ];
            }

            return [
                'success' => false,
                'message_id' => null,
                'error' => $response->json('message', 'Unknown Twilio API Error'),
            ];

        } catch (\Exception $e) {
            Log::error("Twilio WhatsApp Exception: " . $e->getMessage());
            return [
                'success' => false,
                'message_id' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
