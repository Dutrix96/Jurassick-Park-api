<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SimulationValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_brecha_manual_falla_si_no_hay_cell_id_y_no_es_random()
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
        ]);

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/admin/simulations/breach', [
                'random' => false,
            ]);

        $response->assertStatus(422);
    }
}