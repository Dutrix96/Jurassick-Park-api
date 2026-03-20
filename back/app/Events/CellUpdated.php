<?php

namespace App\Events;

use App\Models\Cell;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CellUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Cell $cell)
    {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('park'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'cell.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'cell' => [
                'id' => $this->cell->id,
                'row' => $this->cell->row,
                'col' => $this->cell->col,
                'security_level' => $this->cell->security_level,
                'food_level' => $this->cell->food_level,
                'pending_repairs' => $this->cell->pending_repairs,
                'notes' => $this->cell->notes,
                'updated_at' => $this->cell->updated_at,
            ],
        ];
    }
}