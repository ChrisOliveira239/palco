<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MetricController;

Route::post('/metrics', [MetricController::class, 'store']);
Route::get('/metrics/artist/{artistId}', [MetricController::class, 'summary']);
Route::get('/metrics/{artistId}/sales-by-month', [MetricController::class, 'salesByMonth']);
Route::get('/metrics/{artistId}/top-events', [MetricController::class, 'topEvents']);
Route::get('/metrics/{artistId}/revenue-by-period', [MetricController::class, 'revenueByPeriod']);