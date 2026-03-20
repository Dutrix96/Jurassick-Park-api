<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dinosaur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nick',
        'species',
        'age',
        'diet',
        'danger_level',
        'cell_id',
    ];

    public function cell(): BelongsTo
    {
        return $this->belongsTo(Cell::class);
    }
}