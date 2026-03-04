<?php

namespace App\Services;

use App\Models\WhatsappCampaign;
use App\Models\WhatsappContact;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class WhatsappService
{
    /**
     * Send a WhatsApp message to a specific contact for a campaign.
     * This is a mock implementation that simulate an API call.
     */
    public function sendMessage(WhatsappContact $contact, string $content)
    {
        // In a real scenario, you would integrate with Meta/Twilio API here.
        // For demonstration, we'll simulate a 90% success rate.
        
        $isSuccess = rand(1, 100) <= 90;
        
        if (!$isSuccess) {
            throw new \Exception("Carrier rejected message: Simulated failure for {$contact->phone_number}");
        }

        // Simulate API latency
        // usleep(200000); 

        return [
            'success' => true,
            'message_id' => 'wa_' . uniqid(),
        ];
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
