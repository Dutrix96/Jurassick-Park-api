<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Cell;
use App\Models\Task;
use App\Models\Dinosaur;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CellDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_puede_ver_detalle_de_celda_con_dinosaurios_y_tareas()
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
        ]);

        $worker = User::factory()->create([
            'role' => 'VETERINARIO',
        ]);

        $cell = Cell::factory()->create();

        $dinosaur = Dinosaur::factory()->create([
            'cell_id' => $cell->id,
        ]);

        $task = Task::factory()->create([
            'cell_id' => $cell->id,
            'user_id' => $worker->id,
        ]);

        $response = $this->actingAs($admin, 'api')
            ->getJson("/api/admin/cells/{$cell->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $cell->id)
            ->assertJsonPath('data.dinosaurs.0.id', $dinosaur->id)
            ->assertJsonPath('data.tasks.0.id', $task->id)
            ->assertJsonPath('data.tasks.0.user.id', $worker->id);
    }
}