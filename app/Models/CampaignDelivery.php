<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignDelivery extends Model
{
    protected $fillable = ['campaign_id', 'subscriber_id', 'status', 'error_message', 'sent_at'];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function subscriber()
    {
        return $this->belongsTo(Subscriber::class);
    }
}
