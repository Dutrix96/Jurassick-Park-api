<?php

namespace Database\Seeders;

use App\Models\Cell;
use Illuminate\Database\Seeder;

class CellSeeder extends Seeder
{
    public function run(): void
    {
        $size = 5;

        for ($r = 1; $r <= $size; $r++) {
            for ($c = 1; $c <= $size; $c++) {
                Cell::updateOrCreate(
                    ['row' => $r, 'col' => $c],
                    [
                        'security_level' => rand(50, 95),
                        'food_level' => rand(60, 100),
                        'pending_repairs' => rand(0, 3),
                        'notes' => null,
                    ]
                );
            }
        }
    }
}