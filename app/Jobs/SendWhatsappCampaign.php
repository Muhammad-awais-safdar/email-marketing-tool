<?php

namespace App\Jobs;

use App\Models\WhatsappCampaign;
use App\Models\WhatsappDelivery;
use App\Services\WhatsappService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWhatsappCampaign implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $campaign;

    /**
     * Create a new job instance.
     */
    public function __construct(WhatsappCampaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Execute the job.
     */
    public function handle(WhatsappService $whatsappService): void
    {
        $this->campaign->update(['status' => 'sending']);

        $contacts = $this->campaign->list->contacts;
        $templateContent = $this->campaign->template->content;
        $delay = $this->campaign->send_delay ?: 0;

        foreach ($contacts as $index => $contact) {
            // Apply delay if specified (except for the first message)
            if ($index > 0 && $delay > 0) {
                sleep($delay);
            }

            try {
                $formattedMessage = $whatsappService->formatMessage($templateContent, $contact);
                $whatsappService->sendMessage($contact, $formattedMessage);

                WhatsappDelivery::create([
                    'whatsapp_campaign_id' => $this->campaign->id,
                    'whatsapp_contact_id' => $contact->id,
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);

            } catch (\Exception $e) {
                Log::error("WhatsApp Sending Failed for contact {$contact->id}: " . $e->getMessage());

                WhatsappDelivery::create([
                    'whatsapp_campaign_id' => $this->campaign->id,
                    'whatsapp_contact_id' => $contact->id,
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                ]);
            }
        }

        $this->campaign->update(['status' => 'completed']);
    }
}
