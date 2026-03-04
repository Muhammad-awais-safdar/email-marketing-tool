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
        Schema::table('settings', function (Blueprint $table) {
            // First, drop the existing unique constraint on 'key'
            $table->dropUnique(['key']);
            
            // Add user_id column
            $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');
            
            // Add new unique constraint for user_id and key
            $table->unique(['user_id', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'key']);
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
            $table->unique('key');
        });
    }
};
