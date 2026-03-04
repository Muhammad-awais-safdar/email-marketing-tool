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
        Schema::create('whatsapp_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('whatsapp_list_id')->constrained('whatsapp_lists')->onDelete('cascade');
            $table->foreignId('whatsapp_template_id')->constrained('whatsapp_templates')->onDelete('cascade');
            $table->string('name');
            $table->string('status')->default('draft'); // draft, scheduled, sending, completed, failed
            $table->timestamp('scheduled_at')->nullable();
            $table->integer('send_delay')->default(0); // in seconds
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whatsapp_campaigns');
    }
};
