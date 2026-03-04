<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappContact extends Model
{
    protected $fillable = ['whatsapp_list_id', 'phone_number', 'name'];

    public function list()
    {
        return $this->belongsTo(WhatsappList::class, 'whatsapp_list_id');
    }

    public function deliveries()
    {
        return $this->hasMany(WhatsappDelivery::class);
    }
}
