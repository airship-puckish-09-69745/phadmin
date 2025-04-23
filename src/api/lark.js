import request from '@/utils/request'

// 发送lark信息
export function sendLark(text, warn, envEmpty) {
    return request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
            Path: '/misc/warn',
            Env: envEmpty,
            Text: text,
            Warn: warn,
        }
    })
}