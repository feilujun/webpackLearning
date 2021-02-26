const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
/*
    loader: 1. 下载    2. 使用（配置loader）
    plugins: 1.下载    2. 引入   3. 使用
*/
module.exports = {
    // 入口起点
    entry: './src/js/index.js',
    //输出
    output: {
        // 输出文件名
        filename: 'js/built.js',
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
                    // 'style-loader',
                    // MiniCssExtractPlugin.loader取代style-loader。作用：提取js中的css成单独文件
                    MiniCssExtractPlugin.loader,
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    'css-loader',
                    /*
                        css兼容性处理：postcss --> postcss-loader postcss-preset-env

                        帮postcss找到package.json中browerslist里面的配置，通过配置加载指定的css兼容性样式
                        "browerslist": {
                            // 开发环境 --> 设置node环境变量: process.env.NODE_ENV = development
                            "development": [
                            "last 1 chrome version",
                            "last 1 firefox version",
                            "last 1 safari version"
                            ],
                            // 生产环境 --> 默认看生产环境
                            "production": [
                            ">0.2%",
                            "not dead",
                            "not op_mini all"
                            ]
                        }
                    */
                    // 使用loader的默认配置
                    // 'postcss-loader',
                    // 修改loader的配置
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('postcss-preset-env')()
                                ]
                            }
                        }
                    }
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
                    name: '[hash:10].ext',
                    // 输出目录
                    outputPath: 'imgs'
                }
            },
            {
                // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                test: /\.html$/,
                loader: 'html-loader'
            },
            // 打包其他资源（除了html/js.css资源以外的资源）
            {
                // 排除css/js/html资源
                exclude: /\.(css|js|html|less|jpg|png|gif|json)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'media'
                }
            },
            /*
                语法检查：  eslint-loader eslint
                注意：只检查自己写的源代码，第三方的库是不用检查的
                设置检查规则：package.json中eslintConfig中设置
                airbnb --> eslint-config-airbnb eslint-plugin-import eslint
            */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    // 自动修复eslint的错误
                    fix: true
                }
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
        }),
        new MiniCssExtractPlugin({
            // 对输出的css文件进行重命名
            filename: 'css/built.css'
        }),
        //压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ],
    // 模式
    mode: 'development',
    // mode: 'production'

    // 开发服务器devServer: 用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
    // 特点：只会在内存中编译打包，不会有任何输出
    // 启动devServer指令为：npx webpack-dev-server
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3020,
        //自动打开浏览器
        open: true
    }
}