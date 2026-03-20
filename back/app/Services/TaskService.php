<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Enums\TaskType;
use App\Events\TaskUpdated;
use App\Models\Cell;
use App\Models\Task;

class TaskService
{
    public function createFeedingTask(Cell $cell, int $priority = 2): Task
    {
        $task = Task::create([
            'cell_id' => $cell->id,
            'type' => TaskType::FEEDING->value,
            'title' => 'Reponer alimento en celda (' . $cell->row . ',' . $cell->col . ')',
            'status' => TaskStatus::PENDING->value,
            'priority' => $priority,
        ]);

        broadcast(new TaskUpdated($task));

        return $task;
    }

    public function createMaintenanceTask(Cell $cell, int $priority = 2): Task
    {
        $task = Task::create([
            'cell_id' => $cell->id,
            'type' => TaskType::MAINTENANCE->value,
            'title' => 'Reparar incidencias en celda (' . $cell->row . ',' . $cell->col . ')',
            'status' => TaskStatus::PENDING->value,
            'priority' => $priority,
        ]);

        broadcast(new TaskUpdated($task));

        return $task;
    }

    public function createSecurityTask(Cell $cell, int $priority = 1): Task
    {
        $task = Task::create([
            'cell_id' => $cell->id,
            'type' => TaskType::SECURITY->value,
            'title' => 'Atender brecha de seguridad en celda (' . $cell->row . ',' . $cell->col . ')',
            'status' => TaskStatus::PENDING->value,
            'priority' => $priority,
        ]);

        broadcast(new TaskUpdated($task));

        return $task;
    }

    public function createVeterinaryTask(Cell $cell, int $priority = 2): Task
    {
        $task = Task::create([
            'cell_id' => $cell->id,
            'type' => TaskType::VETERINARY->value,
            'title' => 'Revisar dinosaurios en celda (' . $cell->row . ',' . $cell->col . ')',
            'status' => TaskStatus::PENDING->value,
            'priority' => $priority,
        ]);

        broadcast(new TaskUpdated($task));

        return $task;
    }
}