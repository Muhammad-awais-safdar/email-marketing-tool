<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('whatsapp_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('whatsapp_campaign_id')->constrained('whatsapp_campaigns')->onDelete('cascade');
            $table->foreignId('whatsapp_contact_id')->constrained('whatsapp_contacts')->onDelete('cascade');
            $table->string('status'); // sent, failed
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            // Optimization indexes
            $table->index('status');
            $table->index(['whatsapp_campaign_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_deliveries');
    }
};
