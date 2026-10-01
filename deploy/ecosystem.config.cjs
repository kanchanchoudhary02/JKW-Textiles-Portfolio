module.exports = {
  apps: [{
    name: 'jkw-textiles-api',
    cwd: '/var/www/jkw-textiles/backend',
    script: 'server.js',
    env: { NODE_ENV: 'production', PORT: 5000 },
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
