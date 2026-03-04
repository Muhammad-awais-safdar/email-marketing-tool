<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\EmailListController;
use App\Http\Controllers\Api\SubscriberController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\WhatsappListController;
use App\Http\Controllers\Api\WhatsappContactController;
use App\Http\Controllers\Api\WhatsappTemplateController;
use App\Http\Controllers\Api\WhatsappCampaignController;
use App\Http\Controllers\Api\WhatsappStatsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Email Marketing Routes
    Route::apiResource('email-lists', EmailListController::class);
    Route::apiResource('subscribers', SubscriberController::class);
    Route::apiResource('campaigns', CampaignController::class);
    Route::get('campaigns/{campaign}/stats', [CampaignController::class, 'stats']);
    Route::post('campaigns/{campaign}/send', [CampaignController::class, 'send']);
    Route::apiResource('templates', TemplateController::class);

    // WhatsApp Marketing Routes
    Route::apiResource('whatsapp-lists', WhatsappListController::class);
    Route::apiResource('whatsapp-contacts', WhatsappContactController::class);
    Route::apiResource('whatsapp-templates', WhatsappTemplateController::class);
    Route::apiResource('whatsapp-campaigns', WhatsappCampaignController::class);
    Route::get('whatsapp-campaigns/{whatsappCampaign}/stats', [WhatsappStatsController::class, 'show']);
    Route::post('whatsapp-campaigns/{whatsappCampaign}/send', [WhatsappCampaignController::class, 'send']);
    Route::post('whatsapp-campaigns/{whatsappCampaign}/duplicate', [WhatsappCampaignController::class, 'duplicate']);
});