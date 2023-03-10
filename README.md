# 介绍
本项目是基于 [`vue-element-admin`](https://panjiachen.github.io/vue-element-admin-site/zh/guide/#%E5%8A%9F%E8%83%BD) 做二次开发。它基于 vue 和 element-ui实现。它使用了最新的前端技术栈，内置了 i18 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级中后台产品原型。


## 环境依赖
- [Node.js](https://nodejs.org/zh-cn/)
- git

## 使用
```shell
# 下载项目代码
git clone http://192.168.1.53:3000/go-dev/idadmin.git

# 进入目录
cd idadmin

# 安装依赖包
npm install --registry=https://registry.npm.taobao.org

# npm 设置 淘宝镜像
npm config set registry https://registry.npm.taobao.org
```

## 常用命令行
```shell
1. 开发模式
npm run dev

2. 打包
npm run build:prod
```

## 开发步骤
1. 添加路由
```
path: src/router/index.js

{
  path: '/config', //地址
  component: Layout, //基础末班
  redirect: '/config/sign', //重定向
  children: [{ //子页面
    path: 'sign', //url地址 
    component: () => import('@/views/config/sign'), //view
    name: 'SingReward', //名称
    meta: { 
        title: '签到奖励', //菜单和面包屑标题
        icon: 'user',  //icon
        noCache: true //不缓存,如果缓存请求1次后不在请求
      }
    }
  ]
},
```

2. 添加api
```
src/api/custome_config.js

export function getSignRewards() {
  return get(SUB_KEY_SING_REWARD)
}
```

3. 添加view页面
```
src/api/config/sign.vue
```

4. 组件
```
src/components // 公共组件
src/view/config/components // 业务逻辑组件
```

## 常用功能
1. 路由跳转
因为是单页面开发，所以不能直接重定向，会导致整个页面重新渲染，状态清空
```js
1. html中路由指令
<router-link to="/redirect/url">goto</router-link>
2. js中路由跳转
$router.push('/url')
```

2. vuex 存储全局数据的，比如权限，环境变量。页面刷新之后，数据会清空
```js
import store from '@/store'
// 获取值
const env = store.getters.env
```

3. 全局变量
```js
// 路由
this.$router
// 消息弹框
this.$message
// vuex store
this.$store
```

4. 组件封装
参考案例 `/config/example/list`

## 发布

1. 安装环境
1.1 node 16.0+
1.2 git，本机的publicKey配置到一个github账号下，否则有些包会下载不了
1.3 安装依赖包 npm install，安装之前最好配下淘宝镜像
1.4 配置请求域名，必须打包之前配置好
- .env.development 开发服
- .env.staging 测试服
- .env.production 正式服

1. 编译打包
```sh
# 测试服打包
npm run build:stage

# 正式服打包
npm run build:prod
```

3. 直接打包发布dist目录即可
4. nginx 配置

**页面和静态资源nginx配置**
```sh
server {
        listen       8081;
        server_name  localhost;
        location / {
            root   /Users/byron/company/idadmin/dist;
            index  index.html index.htm;
        }
}
```

**IDAdminService Api代理转发**
```sh
server {
        listen 8082;
        add_header 'Access-Control-Allow-Origin' $http_origin;
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        # x-token 必须带上
        add_header 'Access-Control-Allow-Headers' 'x-token,DNT,web-token,app-token,Authorization,Accept,Origin,Keep-Alive,User-Agent,X-Mx-ReqToken,X-Data-Type,X-Auth-Token,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
        if ($request_method = 'OPTIONS') {
                return 204;
        }
        location / {
                proxy_pass http://192.168.6.15:8088;
        }
}
```

## 印度和巴西项目合并
印度和巴西后台配置项目已经合并，以后只需要在 `idadmin` 项目开发即可， `bradmin` 已经废弃。
开发中区分印度和巴西
1. 环境配置
- .env.development 印度开发环境配置
- .env.devbr 巴西开发环境配置
- .env.staging 印度测试线上环境配置
- .env.stagingbr 巴西测试线上环境配置

2. 命令
印度项目的命令还是和之前一样
```shell
// 印度项目
npm run dev // 启动开发模式
npm run build:stage // 编译打包

// 巴西项目
npm run dev:br //启动开发模式
npm run build:stage:br //编译打包 
```

3. 菜单

`meta` 下的 `project` 属性控制在不同项目中显示菜单，
- 如果不配置，则所有项目显示菜单
- 如果配置了，则只在该项目显示
```js
project: ['id'] //只在印度项目显示
project: ['br'] //只在巴西项目显示
```

4. 业务逻辑区分项目
```js
this.isIN() //是否是印度项目
this.isBR() //是否是巴西项目

// tips: 这两个是全局函数，不需要导入
```
