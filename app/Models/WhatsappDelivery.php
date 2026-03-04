<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappDelivery extends Model
{
    protected $fillable = [
        'whatsapp_campaign_id',
        'whatsapp_contact_id',
        'status',
        'error_message',
        'sent_at'
    ];

    public function campaign()
    {
        return $this->belongsTo(WhatsappCampaign::class, 'whatsapp_campaign_id');
    }

    public function contact()
    {
        return $this->belongsTo(WhatsappContact::class, 'whatsapp_contact_id');
    }
}
