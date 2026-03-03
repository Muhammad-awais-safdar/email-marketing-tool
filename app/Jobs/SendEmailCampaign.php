<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Campaign;
use App\Mail\CampaignEmail;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEmailCampaign implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $campaign;

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

        foreach ($subscribers as $subscriber) {
            Mail::to($subscriber->email)->send(new CampaignEmail($this->campaign, $subscriber));
        }

        $this->campaign->update(['status' => 'sent']);
    }
}
