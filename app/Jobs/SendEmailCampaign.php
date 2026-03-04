<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Campaign;
use App\Models\CampaignDelivery;
use App\Mail\CampaignEmail;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Exception;

class SendEmailCampaign implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $campaign;

    /**
     * Create a new job instance.
     */
    public function __construct(Campaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->campaign->update(['status' => 'sending']);

        $subscribers = $this->campaign->emailList->subscribers()->where('status', 'active')->get();

        $delay = $this->campaign->send_delay ?? 10;

        foreach ($subscribers as $index => $subscriber) {
            try {
                Mail::to($subscriber->email)->send(new CampaignEmail($this->campaign, $subscriber));
                
                CampaignDelivery::create([
                    'campaign_id' => $this->campaign->id,
                    'subscriber_id' => $subscriber->id,
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);
            } catch (Exception $e) {
                CampaignDelivery::create([
                    'campaign_id' => $this->campaign->id,
                    'subscriber_id' => $subscriber->id,
                    'status' => 'failed',
                    'error_message' => $e->getMessage(),
                    'sent_at' => now(),
                ]);
            }

            // Implement requested difference between emails
            if ($index < count($subscribers) - 1 && $delay > 0) {
                sleep($delay);
            }
        }

        $this->campaign->update(['status' => 'sent']);
    }
}
