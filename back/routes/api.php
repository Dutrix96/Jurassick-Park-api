<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\CellController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\DinosaurController;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::middleware(['auth:api', 'role:ADMIN'])->prefix('admin')->group(function () {
    Route::apiResource('cells', CellController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('dinosaurs', DinosaurController::class);
});

// TODO falta perfil
// TODO falta simulacro