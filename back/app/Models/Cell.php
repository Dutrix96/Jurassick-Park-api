<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cell extends Model
{
    use HasFactory;

    protected $fillable = [
        'row',
        'col',
        'security_level',
        'food_level',
        'pending_repairs',
        'notes',
    ];

    public function dinosaurs(): HasMany
    {
        return $this->hasMany(Dinosaur::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function simulations(): HasMany
    {
        return $this->hasMany(Simulation::class, 'affected_cell_id');
    }
}