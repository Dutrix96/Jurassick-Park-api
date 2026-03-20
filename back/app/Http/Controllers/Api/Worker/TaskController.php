<?php

namespace App\Http\Controllers\Api\Worker;

use App\Enums\TaskStatus;
use App\Events\TaskUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class TaskController extends Controller
{
    /**
     * Obtener mis tareas
     */
    public function myTasks(): JsonResponse
    {
        $tasks = Task::with('cell')
            ->where('user_id', auth()->id())
            ->orderBy('priority')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Tareas obtenidas correctamente',
            'data' => $tasks,
        ]);
    }

    /**
     * Cambiar estado de una tarea
     */
    public function updateStatus(UpdateTaskStatusRequest $request, Task $task): JsonResponse
    {
        $user = auth()->user();

        if ($task->user_id !== $user->id) {
            abort(403, 'No puedes modificar esta tarea');
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
            'message' => 'Estado actualizado correctamente',
            'data' => $task->load(['cell', 'user']),
        ]);
    }
}