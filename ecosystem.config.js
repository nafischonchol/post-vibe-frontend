module.exports = {
  apps : [{
    name: "POST-VIBE",
    script: "npm",
    args: "start",
    env: {
      PORT: 3092,
      NODE_ENV: "production",
    }
  }]
}

//pm2 start ecosystem.config.js