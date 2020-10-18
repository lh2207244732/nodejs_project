const http = require('http')
const fs = require('fs')
const path = require('path')
const mime = require('./mime.json')
// 创建服务对象，传入的回调函数会在每次收到请求时被执行
const server = http.createServer((req, res) => {
    //格式化地址，约定所有静态文件储存在当前文件所在文件夹的/static/文件夹中
    const filePath = path.normalize(__dirname + '/static/' + req.url)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // 错误处理
            //设置响应头
            res.setHeader('Content-Type', 'text/html;charset=UTF-8')
            //设置响应HTTP状态码
            res.statusCode = 404
            res.end('<h1>您请求的内容走丢了</h1>')
        } else {
            // 获取请求文件扩展名
            const extname = path.extname(filePath)
            const mimeType = mime[extname] || 'text/plain'
            // 设置响应头
            res.setHeader('Content-Type', mimeType + ";charset=UTF-8")
            // 返回数据
            res.end(data)
        }
    })
})
//监听端口，当服务器准备就绪，执行函数
server.listen(3000, '127.0.0.1', () => {
    console.log('server is running...')
})