// PM2 Ecosystem Configuration for Lens Comparator (Production Mode)
export default {
  apps: [
    {
      name: 'lens-comparator',
      script: 'launch_lens_comparator.sh',
      interpreter: '/bin/bash',
      cwd: '/home/grapeot/lens-comparator',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      exec_mode: 'fork',
    },
  ],
};

