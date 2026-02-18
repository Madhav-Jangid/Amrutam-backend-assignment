import http from 'http';

export const startSelfHealthCheck = (url: string, intervalMs: number = 30000) => {
  let failureCount = 0;
  const maxRetries = 3;

  const checkHealth = () => {
    const req = http.get(url, (res) => {
      const { statusCode } = res;
      if (statusCode === 200) {
        failureCount = 0;
        // Consume response data to free up memory
        res.resume();
      } else {
        handleFailure(`Health check returned status ${statusCode}`);
      }
    });

    req.on('error', (e) => {
      handleFailure(e.message);
    });

    req.end();
  };

  const handleFailure = (message: string) => {
    failureCount++;
    console.error(`Self-health check failed (${failureCount}/${maxRetries}): ${message}`);

    if (failureCount >= maxRetries) {
      console.error('Max retries reached. Shutting down server due to health check failure.');
      process.exit(1);
    }
  };

  // Initial check after a short delay
  setTimeout(() => {
    checkHealth();
    setInterval(checkHealth, intervalMs);
  }, 5000);
};
