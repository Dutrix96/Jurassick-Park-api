<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@jurassic.local'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'role' => 'ADMIN',
                'avatar_url' => null,
            ]
        );

        // Vets
        for ($i = 1; $i <= 3; $i++) {
            User::updateOrCreate(
                ['email' => "vet{$i}@jurassic.local"],
                [
                    'name' => "Vet {$i}",
                    'password' => Hash::make('vet123'),
                    'role' => 'VET',
                    'avatar_url' => null,
                ]
            );
        }

        // Maintenance
        for ($i = 1; $i <= 3; $i++) {
            User::updateOrCreate(
                ['email' => "maint{$i}@jurassic.local"],
                [
                    'name' => "Maint {$i}",
                    'password' => Hash::make('maint123'),
                    'role' => 'MAINT',
                    'avatar_url' => null,
                ]
            );
        }
    }
}