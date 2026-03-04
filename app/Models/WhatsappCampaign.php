<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappCampaign extends Model
{
    protected $fillable = [
        'user_id',
        'whatsapp_list_id',
        'whatsapp_template_id',
        'name',
        'status',
        'scheduled_at',
        'send_delay'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function list()
    {
        return $this->belongsTo(WhatsappList::class, 'whatsapp_list_id');
    }

    public function template()
    {
        return $this->belongsTo(WhatsappTemplate::class, 'whatsapp_template_id');
    }

    public function deliveries()
    {
        return $this->hasMany(WhatsappDelivery::class);
    }
}
