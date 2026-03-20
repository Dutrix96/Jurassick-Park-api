<?php

namespace App\Enums;

enum TaskType: string
{
    case FEEDING = 'feeding';
    case MAINTENANCE = 'maintenance';
    case VETERINARY = 'veterinary';
    case SECURITY = 'security';
}