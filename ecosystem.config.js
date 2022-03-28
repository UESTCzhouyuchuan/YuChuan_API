module.exports = {
  apps: [
    {
      name: 'API-dev',
      script: 'app.js',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: '',
      exec_mode: 'fork', //
      instances: 1,
      autorestart: true,
      watch: true,
      ignore_watch: ['logs', 'test.js', 'test_api.http', '.vscode', '.git'],
      max_memory_restart: '1G',
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log',
      combine_logs: true,
      merge_log: true,
      env: {
        PORT: 8080,
        MONGO: 'myhoney.club',
        NODE_ENV: 'development',
      },
    },
    {
      name: 'API-produ',
      script: 'app.js',
      args: '',
      exec_mode: 'cluster',
      instances: 0,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log',
      combine_logs: true,
      merge_log: true,
      env: {
        PORT: 8080,
        MONGO: 'localhost',
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      user: 'ubuntu', //ssh 用户
      host: 'www.myhoney.club', //ssh 地址
      ref: 'origin/master', //GIT远程/分支
      repo: 'git@github.com:UESTCzhouyuchuan/YuChuan_API.git', //git地址
      path: '/home/ubuntu/project/YuChuan_API', //服务器文件路径
      'post-setup': 'npm install && npm run start',
      'post-deploy': 'npm install && pm2 reload API-produ', //部署后的动作
    },
  },
};
