# 开发服启动脚本
ps aux | grep phadmin | grep -v grep | grep 'vue-cli-service.js' | awk '{print $2}' |xargs --no-run-if-empty kill -9

nohup npm run dev > stdout.txt 2>stderr.txt &

ps aux | grep phadmin | grep -v grep 
