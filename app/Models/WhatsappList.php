<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhatsappList extends Model
{
    protected $fillable = ['user_id', 'name', 'description'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contacts()
    {
        return $this->hasMany(WhatsappContact::class);
    }

    public function campaigns()
    {
        return $this->hasMany(WhatsappCampaign::class);
    }
}
