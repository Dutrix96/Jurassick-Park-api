import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echoInstance = null;

export function getEcho() {
  if (echoInstance) {
    return echoInstance;
  }

  const wsHost = import.meta.env.VITE_WS_HOST || window.location.hostname;
  const wsPort = Number(import.meta.env.VITE_WS_PORT || 8082);
  const isSecure = import.meta.env.VITE_WS_SCHEME === 'wss';

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    wsHost,
    wsPort,
    wssPort: wsPort,
    forceTLS: isSecure,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
  });

  return echoInstance;
}