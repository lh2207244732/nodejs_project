const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const swig = require('swig')
const mime = require('./mime.json')
    // 创建服务对象，传入的回调函数会在每次收到请求时被执行
const server = http.createServer((req, res) => {
        const parseUrl = url.parse(req.url)
        const pathName = parseUrl.pathname

        //判断
        if (pathName == '/' || pathName == '/index.html') {
            const filePath = path.normalize(__dirname + "/static/index.html")
                //引入模版
            const template = swig.compileFile(filePath)
            const html = template({
                data: [{ "id": "1", "task": "吃饭" }, { "id": "2", "task": "学习" }]
            })
            res.setHeader('Content-type', "text/html;charset=UTF-8")
            res.end(html)
                // 读取文件
                // fs.readFile(filePath, (err, data) => {
                //     if (err) {
                //         // 错误处理
                //         //设置响应头
                //         res.setHeader('Content-Type', 'text/html;charset=UTF-8')
                //             //设置响应HTTP状态码
                //         res.statusCode = 404
                //         res.end('<h1>您请求的内容走丢了</h1>')
                //     } else {
                //         //设置响应头
                //         res.setHeader('Content-Type', 'text/html;charset=UTF-8')
                //             // 返回数据
                //         res.end(data)
                //     }
                // })
        } else if (pathName == '/add') {
            //添加文件处理
            res.end(data)
        } else if (pathName == '/del') {
            //删除文件处理
        }
        // 处理静态资源
        else {
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
        }
    })
    //监听端口，当服务器准备就绪，执行函数
server.listen(3000, '127.0.0.1', () => {
    console.log('server is running...')
})