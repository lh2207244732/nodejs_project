const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const querystring = require('querystring')
const { IncomingForm } = require('formidable')
const swig = require('swig')
const mime = require('./mime.json')
const {get, del, add } = require('./model/item.js')
    // 创建服务对象，传入的回调函数会在每次收到请求时被执行
const server = http.createServer(async(req, res) => {
        const parseUrl = url.parse(req.url, true)
        const pathName = parseUrl.pathname
            //判断
        if (pathName == '/' || pathName == '/index.html') {
            try {
                const filePath = path.normalize(__dirname + "/static/index.html")
                const data = await get()
                    //引入模版
                const template = swig.compileFile(filePath)
                const html = template({
                    data: data
                })
                res.setHeader('Content-type', "text/html;charset=UTF-8")
                res.end(html)
            } catch (err) {
                // 错误处理
                //设置响应头
                res.setHeader('Content-Type', 'text/html;charset=UTF-8')
                    //设置响应HTTP状态码
                res.statusCode = 404
                res.end('<h1>您请求的内容走丢了</h1>')
            }
        }
        //添加文件处理
        else if (pathName == '/add') {
            try {
                let body = ''
                    // 利用流 监听事件，写入文件
                req.on('data', chunk => {
                    body += chunk
                })
                req.on('end', async() => {
                    const query = querystring.parse(body)
                    const data = await add(query.task)
                    res.end(JSON.stringify({
                        code: 0,
                        msg: 'add success',
                        data: data
                    }))
                })

            } catch (e) {
                console.log(e)
                res.end(JSON.stringify({
                    code: 1,
                    msg: 'add err'
                }))
            }
        }
        //删除文件处理
        else if (pathName == '/del') {
            //获取get请求的参数
            const id = parseUrl.query.id
                //删除数据
            try {
                await del(id)
                    //成功返回
                return res.end(JSON.stringify({
                    code: 0,
                    msg: 'del ok'
                }))
            } catch (e) {
                console.log(e)
                    //失败返回
                return res.end(JSON.stringify({
                    code: 1,
                    msg: 'del error'
                }))
            }
        }
        // 上传文件处理
        else if (pathName == '/upload') {
            //生成一个incomingForm对象
            let incomingForm = new IncomingForm({
                    uploadDir: "./static/images", //设置文件保存的路径
                    keepExtensions: true //文件保留扩展名
                })
                //用incomingForm对象的parse方法来解析表单传入的数据
            incomingForm.parse(req, (err, fields, files) => {
                if (err) {
                    console.log(err)
                    res.end(JSON.stringify({
                        code: 1,
                        msg: 'upload err'
                    }))
                } else {
                    res.end({
                        code: 0,
                        msg: 'upload success',
                        data: files.avatar.path.substr(7) //把文件路径中'static/'截取掉
                    })
                }
            })

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