module.exports = {
  apps: [{
    name: 'agent-toolbox',
    script: 'dist/index.js',
    exec_mode: 'fork',
    env: { NODE_ENV: 'production', PORT: 3100 },
    instances: 1,
    max_memory_restart: '1G'
  }]
}
