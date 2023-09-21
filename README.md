# 基于 craco 自定义配置 create-react-app 模版

### Thanks

Extends [ChrisUser/cra-template-complete-web-app](https://github.com/ChrisUser/cra-template-complete-web-app)

### 执行命令

| 命令          | 作用                |
| ------------- | ------------------- |
| yarn start    | 启动开发            |
| yarn test     | 启动测试            |
| yarn lint     | eslint 检查         |
| yarn lint:fix | eslint 修复         |
| yarn prettier | prettier 检查       |
| yarn format   | prettier 修复       |
| yarn analyze  | 分析bundler体积大小 |

### 对于第三方库的抽离

Step1

```
在 externals 里面声明
```

Step2

```
在 htmlWebpackPlugin -> cdn 内配置对应的 js 和 css 链接
```

Then

```
打包的时候就会自动注入
```

### IMPORTANT！！！

```
只要路由缓存完成，React系的开发就打开了新世界的大门~~
```
