<?php

namespace App\Gateways\Whatsapp;

use App\Gateways\Contracts\WhatsappGatewayInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CustomGateway implements WhatsappGatewayInterface
{
    public function send(string $to, string $message, array $config): array
    {
        $webhookUrl = $config['webhook_url'] ?? '';
        $apiKey = $config['api_key'] ?? '';
        $instanceId = $config['instance_id'] ?? '';

        if (empty($webhookUrl)) {
            throw new \Exception("Custom WhatsApp Gateway requires a Webhook URL.");
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'X-Instance-Id' => $instanceId,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])->post($webhookUrl, [
                'number' => $to,
                'message' => $message,
            ]);

            Log::debug("Custom WA Gateway Response", ['status' => $response->status(), 'body' => $response->json()]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'message_id' => $data['messageId'] ?? $data['id'] ?? 'cwg_' . uniqid(),
                ];
            }

            return [
                'success' => false,
                'message_id' => null,
                'error' => $response->body() ?: 'Unknown Custom Gateway Error',
            ];

        } catch (\Exception $e) {
            Log::error("Custom WA Gateway Exception: " . $e->getMessage());
            return [
                'success' => false,
                'message_id' => null,
                'error' => $e->getMessage(),
            ];
        }
    }
}
