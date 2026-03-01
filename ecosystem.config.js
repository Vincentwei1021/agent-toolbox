module.exports = {
  apps: [{
    name: 'agent-toolbox',
    script: 'dist/index.js',
    env: { NODE_ENV: 'production', PORT: 3100 },
    instances: 1,
    max_memory_restart: '1G'
  }]
}
