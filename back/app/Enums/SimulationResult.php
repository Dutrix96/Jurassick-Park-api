<?php

namespace App\Enums;

enum SimulationResult: string
{
    case OK = 'OK';
    case CONTAINED = 'CONTAINED';
    case ESCAPE = 'ESCAPE';
    case INCIDENT = 'INCIDENT';
}