<?php

namespace App\Gateways\Whatsapp;

use App\Gateways\Contracts\WhatsappGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaCloudGateway implements WhatsappGatewayInterface
{
    public function send(string $to, string $message, array $config): array
    {
        $token = $config['api_key'] ?? '';
        $phoneId = $config['instance_id'] ?? '';

        if (empty($token) || empty($phoneId)) {
            throw new \Exception("Meta Cloud API requires both API Token (api_key) and Phone Number ID (instance_id).");
        }

        $url = "https://graph.facebook.com/v19.0/{$phoneId}/messages";

        try {
            $response = Http::withToken($token)->post($url, [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'text',
                'text' => [
                    'body' => $message
                ]
            ]);

            Log::debug("Meta WhatsApp Response", ['status' => $response->status(), 'body' => $response->json()]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'message_id' => $data['messages'][0]['id'] ?? 'meta_' . uniqid(),
                ];
            }

            return [
                'success' => false,
                'message_id' => null,
                'error' => $response->json('error.message', 'Unknown Meta API Error'),
            ];

        } catch (\Exception $e) {
            Log::error("Meta WhatsApp Exception: " . $e->getMessage());
            return [
                'success' => false,
                'message_id' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
