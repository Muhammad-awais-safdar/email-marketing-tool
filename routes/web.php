<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\EmailListController;
use App\Http\Controllers\Api\SubscriberController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return view('welcome');
})->name('login');

Route::fallback(function () {
    return view('welcome');
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/user', [AuthController::class, 'user'])->middleware('auth');

Route::middleware(['web','auth'])->group(function () {
    Route::apiResource('email-lists', EmailListController::class);
    Route::apiResource('subscribers', SubscriberController::class);
    Route::apiResource('campaigns', CampaignController::class);
    Route::post('campaigns/{campaign}/send', [CampaignController::class, 'send']);
    Route::apiResource('templates', TemplateController::class);
    Route::get('dashboard/stats', [DashboardController::class, 'index']);
});
