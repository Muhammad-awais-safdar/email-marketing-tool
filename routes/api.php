<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\EmailListController;
use App\Http\Controllers\Api\SubscriberController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\TemplateController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::apiResource('email-lists', EmailListController::class);
    Route::apiResource('subscribers', SubscriberController::class);
    Route::apiResource('campaigns', CampaignController::class);
    Route::get('campaigns/{campaign}/stats', [CampaignController::class, 'stats']);
    Route::post('campaigns/{campaign}/send', [CampaignController::class, 'send']);
    Route::apiResource('templates', TemplateController::class);
});