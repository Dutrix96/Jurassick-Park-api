import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export function getEcho() {
  if (echoInstance) {
    return echoInstance;
  }

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'local',
    wsHost: import.meta.env.VITE_WS_HOST || window.location.hostname,
    wsPort: Number(import.meta.env.VITE_WS_PORT || 6001),
    wssPort: Number(import.meta.env.VITE_WS_PORT || 6001),
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
  });

  return echoInstance;
}