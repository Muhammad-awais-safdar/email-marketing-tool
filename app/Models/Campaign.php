<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'subject', 'content', 'status', 'scheduled_at', 'email_list_id', 'send_delay'];

    public function emailList()
    {
        return $this->belongsTo(EmailList::class);
    }

    public function deliveries()
    {
        return $this->hasMany(CampaignDelivery::class);
    }
}
