<?php

namespace App\Events;

use App\Models\Simulation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SimulationFinished implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Simulation $simulation)
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
        return 'simulation.finished';
    }

    public function broadcastWith(): array
    {
        return [
            'simulation' => [
                'id' => $this->simulation->id,
                'type' => $this->simulation->type,
                'result' => $this->simulation->result,
                'triggered_by' => $this->simulation->triggered_by,
                'affected_cell_id' => $this->simulation->affected_cell_id,
                'report' => $this->simulation->report,
                'created_at' => $this->simulation->created_at,
            ],
        ];
    }
}