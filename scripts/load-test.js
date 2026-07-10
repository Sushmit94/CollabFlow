import ws from 'k6/ws';
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    ws_session_duration: ['p(95)<30000'],
  },
};

const API_URL = __ENV.API_URL || 'http://localhost:4000';
const WS_URL = __ENV.WS_URL || 'ws://localhost:4000/ws';

export default function () {
  const health = http.get(`${API_URL}/health`);
  check(health, { 'api healthy': (res) => res.status === 200 });

  const userId = `load-user-${__VU}-${__ITER}`;
  const res = ws.connect(WS_URL, {}, (socket) => {
    socket.on('open', () => {
      socket.send(JSON.stringify({
        type: 'join_room',
        roomId: 'doc-1',
        userId,
        payload: { name: `Load ${__VU}` },
        timestamp: Date.now(),
      }));
    });

    socket.setInterval(() => {
      socket.send(JSON.stringify({
        type: 'cursor_move',
        roomId: 'doc-1',
        userId,
        payload: { x: Math.random() * 900, y: Math.random() * 700 },
        timestamp: Date.now(),
      }));
    }, 1000);

    socket.setTimeout(() => socket.close(), 10000);
  });

  check(res, { 'ws connected': (r) => r && r.status === 101 });
  sleep(1);
}
