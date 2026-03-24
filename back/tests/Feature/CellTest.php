<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Cell;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CellTest extends TestCase
{
    use RefreshDatabase;

    private function admin()
    {
        return User::factory()->create(['role' => 'ADMIN']);
    }

    public function test_crear_celda()
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/admin/cells', [
                'row' => 1,
                'col' => 1,
                'security_level' => 50,
                'food_level' => 80,
                'pending_repairs' => 0
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('cells', ['row' => 1, 'col' => 1]);
    }

    public function test_actualizar_celda()
    {
        $admin = $this->admin();
        $cell = Cell::factory()->create();

        $response = $this->actingAs($admin, 'api')
            ->putJson("/api/admin/cells/{$cell->id}", [
                'security_level' => 90
            ]);

        $response->assertStatus(200);
    }

    public function test_eliminar_celda()
    {
        $admin = $this->admin();
        $cell = Cell::factory()->create();

        $response = $this->actingAs($admin, 'api')
            ->deleteJson("/api/admin/cells/{$cell->id}");

        $response->assertStatus(200);
    }
}