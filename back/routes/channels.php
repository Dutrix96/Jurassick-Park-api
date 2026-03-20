<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('park', function () {
    return true;
});