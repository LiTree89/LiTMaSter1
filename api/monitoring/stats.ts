import type { VercelRequest, VercelResponse } from '@vercel/node';
import os from 'os';

let apiRequests = 0;
let errors = 0;
const startTime = Date.now();

export default function handler(req: VercelRequest, res: VercelResponse) {
  apiRequests++;
  try {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
    const cpuUsage = os.loadavg()[0];
    res.status(200).json({
      uptime: `${uptime}s`,
      memoryUsage: `${memoryUsage.toFixed(2)} MB`,
      cpuUsage: `${cpuUsage.toFixed(2)}`,
      apiRequests,
      errors,
    });
  } catch (err) {
    errors++;
    res.status(500).json({ error: 'Failed to get stats' });
  }
}
