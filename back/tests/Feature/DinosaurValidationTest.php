<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DinosaurValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_no_puede_crear_dinosaurio_con_datos_invalidos()
    {
        $admin = User::factory()->create([
            'role' => 'ADMIN',
        ]);

        $response = $this->actingAs($admin, 'api')
            ->postJson('/api/admin/dinosaurs', [
                'nick' => '',
                'species' => '',
                'age' => -1,
                'diet' => '',
                'danger_level' => '',
                'cell_id' => 999999,
            ]);

        $response->assertStatus(422);
    }
}