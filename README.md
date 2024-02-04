
## 感谢
排名不分先后
-  uni-simple-router [开发文档](https://v2.hhyang.cn/v2/start/quickstart.html)
-  uviewui [开发文档](https://uviewui.com/components/intro.html)
-  RuleApi [开发文档](https://github.com/buxia97/ruleapi)

## 开发规范
请Fork一份源码到自己存储桶上，确保自己的代码规范美观，需要合并请合并到Dev分支
QQ交流群：869350741 

后端源码：[Github](https://github.com/coruni/backend)

## 架设教程
### 准备步骤

1. 服务器环境 ubuntu
2. 服务器配置 1H1G 最低

### 安装环境

安装JAVA17
你可以选装JAVA8 只要能运行就行

```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

我推荐使用宝塔，如果你啥都不会的话
在宝塔面板中安装`redis`，`nginx`，`mysql`，`phpMyadmin`，`php7.4` php选装

### 启动服务

先下载jar文件这个是必须的，`1.0.0`是版本 如果这个链接无法下载请到[github](https://github.com/coruni/backend)中获取最新链接

```
mkdir /server
cd /server
wget https://github.com/coruni/backend/releases/download/1.0.0/TypeAPi-1.0.0.jar
```

然后在server目录下创建一个名为`application.properties`的文件，然后写入以下信息

```
# 服务端口

server.port=5544

# slf4j配置输出mybatis-dao相关的操作为DEBUG级别, 数据库日志会打印到debug文件中

logging.level.com.TypeApi.dao=DEBUG
logging.config=classpath:logback-spring.xml

# mybaits配置文件

mybatis.mapper-locations = classpath:mapper/*Mapper.xml
mybatis.type-aliases-package = com.RuleApi.entity

# mysql配置

spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/123123?characterEncoding=UTF-8
spring.datasource.username=123123
spring.datasource.password=123123

# mysql数据表前缀，如果没改过就别动

mybatis.configuration.variables.prefix=chikata

# redis配置

spring.session.store-type=redis
spring.redis.host=127.0.0.1
spring.redis.password=
spring.redis.port=6379

# 连接池最大连接数（使用负值表示没有限制）

spring.redis.jedis.pool.max-active=20

# 连接池最大阻塞等待时间（使用负值表示没有限制）

spring.redis.jedis.pool.max-wait=-1

# 连接池中的最大空闲连接

spring.redis.jedis.pool.max-idle=10

# 连接池中的最小空闲连接

spring.redis.jedis.pool.min-idle=0

# 连接超时时间（毫秒）

spring.redis.timeout=3000

# 邮件发送配置，实际测试来看，建议使用QQ邮箱

#POP3服务器: pop.qq.com
#SMTP服务器: smtp.qq.com
#IMAP服务器: imap.qq.com
spring.mail.host=smtp.qq.com
spring.mail.username=1292778464@qq.com
#spring.mail.from不支持中文，需要中文，看mail.properties
spring.mail.password=tjufrxkxnwobidae
#465或者994
spring.mail.properties.mail.smtp.port: 465
spring.mail.properties.mail.smtp.ssl.enable: true
spring.mail.default-encoding=UTF-8

# 网站配置

# key为密钥，用于访问可视化配置中心,usertime为用户登录状态过期时间，以秒为单位，默认为24小时可自行设置

# uploadUrl为图片或附件路径的域名，用于返回本地图片时的路径，可以设置为接口，也可以自定义域名反向代理接口再设置缓存。

# contentCache,contentInfoCache,CommentCache,userCache分别是文章列表，文章信息，评论列表，用户列表的缓存时间，单位是s

webinfo.key=123456

webinfo.usertime=864000
webinfo.contentCache=0
webinfo.contentInfoCache=0
webinfo.CommentCache=6
webinfo.userCache=10

# 数据前缀，默认不需要修改，当同一个服务器运行多个API接口的时候，则需要设置不同的前缀，防止redis数据混淆。

web.prefix=chikata

# 支付宝当面付网关地址

gateway_url=https://openapi.alipaydev.com/gateway.do

#xss拦截白名单
mica.xss.allow-tags = p, audio, video
mica.xss.allow-attributes = src, controls, controlslist, id, width, height, webkit-playsinline, playsinline, x5-playsinline, style

# 下面是请求最大值定义

#server.max-http-header-size=10000000

#文件上传限制，单文件和总文件
spring.servlet.multipart.enabled: true
spring.servlet.multipart.max-file-size=200MB
spring.servlet.multipart.max-request-size=300MB
#spring.servlet.multipart.location=/data/tmp

# token签发定义

#密钥
token.secret=woyongyuanaini
#签发人
token.issue=chikata

# 过期时间

token.exp = 7

```
### 配置说明
端口`5544`
```
server.port=5544
```

mysql配置信息
username是数据库用户名
password是数据库密码
`jdbc:mysql://127.0.0.1:3306/123123?characterEncoding=UTF-8`中的`123123`是数据库名
```
# mysql配置
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/123123?characterEncoding=UTF-8
spring.datasource.username=123123
spring.datasource.password=123123
```

这个是webkey安装系统之类的需要 请务必保管好
```
webinfo.key=123456
```

其余配置都有相对应的注释

配置完成之后请确保jar文件和配置文件在同一个目录下
```
nohup java -jar Typeapi-*.jar  >log.txt 2&1 &
```

### 配置反向代理
启动完成之后在宝塔面板中新建一个站点 开启https 并开启强制 不需要php 只需要静态即可
并在URL重写中配置
```
location ^~ / {
  add_header 'Access-Control-Allow-Origin' '*';
  add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
  add_header 'Access-Control-Allow-Credentials' 'true';
  add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,X-Data-Type,X-Requested-With,X-Data-Type,X-Auth-Token';
  if ( $request_method = 'OPTIONS' ) { 
    return 200;
  }
  proxy_pass http://127.0.0.1:5544;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header REMOTE-HOST $remote_addr;
}
```

不出意外的话这样就完成了




## 计划
1. 完善商城（完成）
2. 修复修改文章 ID错误问题（完成）
3. 添加等级经验配置（未）
4. 添加回复等级查看（未）
5. ~~添加作者获得积分比例~~ (完成)


## 捐赠
<div style="text-align:center">
<p>您的捐赠是我最大的动力</p>
<div style="display:flex;justify-content:center">
<img src="https://picss.sunbangyan.cn/2023/11/12/12e1a67502cc3466960620996e52fbe6.png" style="width:30%;height:30%" alt="微信">
<img src="https://picss.sunbangyan.cn/2023/11/12/7aa04131a74f5040b1621548a87602ac.jpg" style="width:30%;height:30%" alt="支付宝">
</div>
</div>
