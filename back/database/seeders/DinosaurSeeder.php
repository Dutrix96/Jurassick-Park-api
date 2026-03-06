<?php

namespace Database\Seeders;

use App\Models\Cell;
use App\Models\Dinosaur;
use Illuminate\Database\Seeder;

class DinosaurSeeder extends Seeder
{
    public function run(): void
    {
        $dinos = [
            // Herbivoros
            ['species' => 'Triceratops', 'diet' => 'HERB', 'danger' => 'MEDIO'],
            ['species' => 'Brachiosaurus', 'diet' => 'HERB', 'danger' => 'BAJO'],
            ['species' => 'Stegosaurus', 'diet' => 'HERB', 'danger' => 'MEDIO'],
            ['species' => 'Ankylosaurus', 'diet' => 'HERB', 'danger' => 'MEDIO'],
            ['species' => 'Parasaurolophus', 'diet' => 'HERB', 'danger' => 'BAJO'],
            ['species' => 'Gallimimus', 'diet' => 'HERB', 'danger' => 'BAJO'],

            // Omnivoros
            ['species' => 'Oviraptor', 'diet' => 'OMNI', 'danger' => 'MEDIO'],
            ['species' => 'Ornitholestes', 'diet' => 'OMNI', 'danger' => 'MEDIO'],
            ['species' => 'Therizinosaurus', 'diet' => 'OMNI', 'danger' => 'ALTO'],

            // Carnivoros
            ['species' => 'Velociraptor', 'diet' => 'CARN', 'danger' => 'MUY_ALTO'],
            ['species' => 'Dilophosaurus', 'diet' => 'CARN', 'danger' => 'MUY_ALTO'],
            ['species' => 'Carnotaurus', 'diet' => 'CARN', 'danger' => 'MUY_ALTO'],
            ['species' => 'Allosaurus', 'diet' => 'CARN', 'danger' => 'MUY_ALTO'],
            ['species' => 'Tyrannosaurus rex', 'diet' => 'CARN', 'danger' => 'EXTREMO'],
            ['species' => 'Spinosaurus', 'diet' => 'CARN', 'danger' => 'EXTREMO'],
            ['species' => 'Giganotosaurus', 'diet' => 'CARN', 'danger' => 'EXTREMO'],
            ['species' => 'Indominus rex', 'diet' => 'CARN', 'danger' => 'CRITICO'],
        ];

        $cells = Cell::all();
        if ($cells->isEmpty()) {
            return;
        }

        for ($i = 1; $i <= 40; $i++) {
            $base = $dinos[array_rand($dinos)];
            $cell = $cells->random();

            Dinosaur::updateOrCreate(
                ['nick' => "Dino{$i}"],
                [
                    'species' => $base['species'],
                    'age' => rand(1, 40),
                    'diet' => $base['diet'],
                    'danger_level' => $base['danger'],
                    'cell_id' => $cell->id,
                ]
            );
        }
    }
}