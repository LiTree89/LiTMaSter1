// api/index.js
// Main entry for Express API server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Monitoring stats endpoint
app.use('/monitoring/stats', (req, res) => {
  // Use the same logic as in stats.ts
  const os = require('os');
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  const cpuLoad = os.loadavg();
  const platform = os.platform();
  const arch = os.arch();
  const nodeVersion = process.version;
  const cpus = os.cpus().length;

  res.json({
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
    },
    uptime,
    cpuLoad,
    platform,
    arch,
    nodeVersion,
    cpus,
    timestamp: Date.now(),
  });
});

const PORT = process.env.PORT || 7071;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
