<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\TaskStatus;
use App\Events\TaskUpdated;
use App\Http\Requests\AssignTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;



class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = Task::with(['cell', 'user'])
            ->orderBy('priority')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lista de tareas obtenida con exito',
            'data' => $tasks,
        ]);
    }

    public function myTasks(): JsonResponse
    {
        $tasks = Task::with('cell')
            ->where('user_id', auth()->id())
            ->orderBy('priority')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Lista de mis tareas obtenida con exito',
            'data' => $tasks,
        ]);
    }

    public function assign(AssignTaskRequest $request, Task $task): JsonResponse
    {
        $this->ensureAdmin();

        $task->user_id = $request->integer('user_id');
        $task->save();

        broadcast(new TaskUpdated($task->fresh(['cell', 'user'])));

        return response()->json([
            'success' => true,
            'message' => 'Tarea asignada con exito',
            'data' => $task->load(['cell', 'user']),
        ]);
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'ADMIN' && $task->user_id !== $user->id) {
            abort(403, 'No autorizado para cambiar esta tarea');
        }

        $newStatus = $request->string('status')->toString();

        $task->status = $newStatus;

        if ($newStatus === TaskStatus::IN_PROGRESS->value && !$task->started_at) {
            $task->started_at = Carbon::now();
        }

        if ($newStatus === TaskStatus::COMPLETED->value) {
            $task->finished_at = Carbon::now();
        }

        if ($newStatus === TaskStatus::PENDING->value) {
            $task->started_at = null;
            $task->finished_at = null;
        }

        $task->save();

        broadcast(new TaskUpdated($task->fresh(['cell', 'user'])));

        return response()->json([
            'success' => true,
            'message' => 'Estado de tarea actualizado con exito',
            'data' => $task->load(['cell', 'user']),
        ]);
    }

    protected function ensureAdmin(): void
    {
        if (auth()->user()->role !== 'ADMIN') {
            abort(403, 'Solo un administrador puede realizar esta accion');
        }
    }
}