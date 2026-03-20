<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\Admin\CellController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\DinosaurController;
use App\Http\Controllers\Api\Admin\TaskController as AdminTaskController;
use App\Http\Controllers\Api\Admin\SimulationController;
use App\Http\Controllers\Api\Worker\TaskController as WorkerTaskController;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::put('profile/password', [ProfileController::class, 'updatePassword']);
    Route::post('profile/avatar', [ProfileController::class, 'updateAvatar']);

    Route::prefix('tasks')->group(function () {
        Route::get('my-tasks', [WorkerTaskController::class, 'myTasks']);
        Route::patch('{task}/status', [WorkerTaskController::class, 'updateStatus']);
    });
});

Route::middleware(['auth:api', 'role:ADMIN'])->prefix('admin')->group(function () {
    Route::apiResource('cells', CellController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('dinosaurs', DinosaurController::class);

    Route::prefix('tasks')->group(function () {
        Route::get('/', [AdminTaskController::class, 'index']);
        Route::patch('{task}/assign', [AdminTaskController::class, 'assign']);
    });

    Route::prefix('simulations')->group(function () {
        Route::post('normal', [SimulationController::class, 'runNormal']);
        Route::post('breach', [SimulationController::class, 'runBreach']);
    });
});