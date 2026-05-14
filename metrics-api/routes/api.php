<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MetricController;

Route::post('/metrics', [MetricController::class, 'store']);
Route::get('/metrics/artist/{artistId}', [MetricController::class, 'summary']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

