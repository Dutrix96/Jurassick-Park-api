<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Simulation extends Model
{
    protected $fillable = [
        'type',
        'result',
        'triggered_by',
        'affected_cell_id',
        'report',
    ];

    protected $casts = [
        'report' => 'array',
    ];

    public function triggeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'triggered_by');
    }

    public function affectedCell(): BelongsTo
    {
        return $this->belongsTo(Cell::class, 'affected_cell_id');
    }
}