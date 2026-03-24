<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Cell;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CellValidationTest extends TestCase
{
    use RefreshDatabase;

    private function admin()
    {
        return User::factory()->create([
            'role' => 'ADMIN',
        ]);
    }

    public function test_no_puede_crear_celda_con_datos_invalidos()
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/admin/cells', [
                'row' => 0,
                'col' => 0,
                'security_level' => 200,
                'food_level' => -1,
                'pending_repairs' => -3,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'row',
                'col',
                'security_level',
                'food_level',
                'pending_repairs',
            ]);
    }

    public function test_no_puede_crear_celdas_duplicadas_en_misma_posicion()
    {
        $admin = $this->admin();

        Cell::factory()->create([
            'row' => 2,
            'col' => 3,
        ]);

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/admin/cells', [
                'row' => 2,
                'col' => 3,
                'security_level' => 80,
                'food_level' => 60,
                'pending_repairs' => 1,
            ]);

        $response->assertStatus(422);
    }
}