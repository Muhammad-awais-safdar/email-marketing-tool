<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\EmailListController;
use App\Http\Controllers\Api\SubscriberController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\WhatsappListController;
use App\Http\Controllers\Api\WhatsappContactController;
use App\Http\Controllers\Api\WhatsappTemplateController;
use App\Http\Controllers\Api\WhatsappCampaignController;
use App\Http\Controllers\Api\WhatsappStatsController;
use App\Http\Controllers\Api\SettingController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('welcome');
})->name('login');

Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user'])->middleware('auth');

    Route::middleware(['web', 'auth'])->group(function () {
        // Email Marketing Routes
        Route::apiResource('email-lists', EmailListController::class);
        Route::apiResource('subscribers', SubscriberController::class);
        Route::apiResource('campaigns', CampaignController::class);
        Route::get('campaigns/{campaign}/stats', [CampaignController::class, 'stats']);
        Route::post('campaigns/{campaign}/send', [CampaignController::class, 'send']);
        Route::apiResource('templates', TemplateController::class);

        // WhatsApp Marketing Routes (v1 prefix to match frontend)
        Route::prefix('v1')->group(function () {
            Route::apiResource('whatsapp-lists', WhatsappListController::class);
            Route::apiResource('whatsapp-contacts', WhatsappContactController::class);
            Route::apiResource('whatsapp-templates', WhatsappTemplateController::class);
            Route::apiResource('whatsapp-campaigns', WhatsappCampaignController::class);
            Route::get('whatsapp-campaigns/{whatsappCampaign}/stats', [WhatsappStatsController::class, 'show']);
            Route::post('whatsapp-campaigns/{whatsappCampaign}/send', [WhatsappCampaignController::class, 'send']);
            Route::post('whatsapp-campaigns/{whatsappCampaign}/duplicate', [WhatsappCampaignController::class, 'duplicate']);
        });

        // Settings Routes
        Route::get('settings', [SettingController::class, 'index']);
        Route::post('settings', [SettingController::class, 'store']);
        Route::post('settings/test-connection', [SettingController::class, 'testConnection']);
        Route::post('settings/test-whatsapp', [SettingController::class, 'testWhatsapp']);

        // Stats & Global Routes
        Route::get('dashboard/stats', [DashboardController::class, 'index']);

        // Auth Routes (JSON versions)
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
    });
});

// Fallback MUST be the last route
Route::fallback(function () {
    return view('welcome');
});
