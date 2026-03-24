<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Task;
use App\Models\Cell;
use Illuminate\Foundation\Testing\RefreshDatabase;

class WorkerTaskFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_worker_puede_ver_solo_sus_tareas()
    {
        $worker = User::factory()->create([
            'role' => 'VETERINARIO',
        ]);

        $otherWorker = User::factory()->create([
            'role' => 'MANTENIMIENTO',
        ]);

        $cell = Cell::factory()->create();

        $myTask = Task::factory()->create([
            'cell_id' => $cell->id,
            'user_id' => $worker->id,
        ]);

        Task::factory()->create([
            'cell_id' => $cell->id,
            'user_id' => $otherWorker->id,
        ]);

        $response = $this->actingAs($worker, 'api')
            ->getJson('/api/tasks/my-tasks');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $myTask->id]);
    }

    public function test_worker_no_puede_cambiar_tarea_de_otro_usuario()
    {
        $worker = User::factory()->create([
            'role' => 'VETERINARIO',
        ]);

        $otherWorker = User::factory()->create([
            'role' => 'MANTENIMIENTO',
        ]);

        $cell = Cell::factory()->create();

        $task = Task::factory()->create([
            'cell_id' => $cell->id,
            'user_id' => $otherWorker->id,
            'status' => 'PENDING',
        ]);

        $response = $this->actingAs($worker, 'api')
            ->patchJson("/api/tasks/{$task->id}/status", [
                'status' => 'in_progress',
            ]);

        $response->assertStatus(403);
    }

    public function test_worker_puede_marcar_tarea_como_finalizada()
    {
        $worker = User::factory()->create([
            'role' => 'VETERINARIO',
        ]);

        $cell = Cell::factory()->create();

        $task = Task::factory()->create([
            'cell_id' => $cell->id,
            'user_id' => $worker->id,
            'status' => 'in_progress',
        ]);

        $response = $this->actingAs($worker, 'api')
            ->patchJson("/api/tasks/{$task->id}/status", [
                'status' => 'completed',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
    }
}