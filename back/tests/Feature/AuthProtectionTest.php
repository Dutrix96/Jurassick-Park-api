<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthProtectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_no_puede_entrar_a_ruta_protegida_sin_token()
    {
        $response = $this->getJson('/api/admin/cells');

        $response->assertStatus(401);
    }

    public function test_no_puede_ver_sus_tareas_sin_token()
    {
        $response = $this->getJson('/api/tasks/my-tasks');

        $response->assertStatus(401);
    }
}