const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
/*
    loader: 1. 下载    2. 使用（配置loader）
    plugins: 1.下载    2. 引入   3. 使用
*/ 
module.exports = {
    // 入口起点
    entry: './src/index.js',
    //输出
    output: {
        // 输出文件名
        filename: 'built.js',
        // 输出路径
        // __dirname node.js的变量，代表当前文件的目录绝对路径
        path: resolve(__dirname, 'build')
    },
    // load配置
    module: {
        rules: [
            // 详细loader配置
            {
                //匹配哪些文件
                test: /\.css$/,
                //使用哪些loader进行处理
                use: [
                    // use数组中loader执行顺序：从右到左，从下到上 依次执行
                    // 创建style标签，将js中的样式资源插入进去，添加到head中生效
                    'style-loader',
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                // 使用多个loader用use
                use: [
                    'style-loader',
                    'css-loader',
                    //将less文件编译成css文件
                    'less-loader'
                ]
            },
            {
                // 处理图片资源  url-loader firl-loader
                // 问题：默认处理不了html中img图片
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb，就会被base64处理，将图片转换为base64字符串，浏览器将其以图片内容去解析
                    // 优点：减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会更大（文件请求速度更慢）
                    limit: 8 * 1024,
                    // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是common.js
                    // 解析时会出现问题：[object Module]
                    // 解决：关闭url-loader的es6模块化，使用commonjs解析
                    esModule: false,
                    // 给图片进行重命名
                    // [hash:10]取图片的hash的前10位
                    // [ext]取文件原来扩展名
                    name: '[hash:10].ext'
                }
            },
            {
                // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    // plugins的配置
    plugins: [
        // 详细plugins的配置
        // heml-webpack-plugin
        // 功能: 默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
        // 需求：需要有结构的HTML文件
        new HtmlWebpackPlugin({
            // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）
            template: './src/index.html'
        })
    ],
    //模式
    mode: 'development'
    // mode: 'production'
}