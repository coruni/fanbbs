如你不是新手 有些步骤可以不用跟着做，只需要保证后端能正常运行就行了

### 系统环境

系统：Linux任意发行版（推荐Ubuntu 20）

规格：最低1C1G

环境：**Nginx**、**redis**、**mysql5.6、java17（可选java8）nodejs**

JAVA安装：

```plain
# Ubuntu
sudo apt update
sudo apt install openjdk-17-jdk

#centos
wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.rpm
sudo yum -y install ./jdk-17_linux-x64_bin.rpm

```


Node安装

```plain
# Ubuntu
sudo apt install nodejs npm -y

#centos
sudo yum install nodejs npm -y
```

### 宝塔安装

**新手可以使用宝塔一键安装 |**| 另外可以备选1panel、aapanel、appnode 并不限制你用什么面板

宝塔：Ubuntu/deepin

```plain
wget -O install.sh https://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh ed8484bec
```

宝塔：centos

```plain
yum install -y wget && wget -O install.sh https://download.bt.cn/install/install_6.0.sh && sh install.sh ed8484bec
```

1. 安装环境
请自行安装**Nginx**、**redis**、**mysql5.6**这三个软件

![image.png](https://s2.loli.net/2024/03/03/uwpnAXBdCPZbva4.png)

2. **解析域名**
解析三个域名

resource (访问资源)

api (API)

backend (后台)

并不限制你解析域名的前缀 只要你自己分得清自己解析的域名是哪个的就行了

3. 新建网站
创建三个网站，分别对应你解析的三个域名，PHP全部选择纯静态

api.xxxxx.com 

resource.xxxxx.com

backend.xxxxx.com

xxxxx.com 改为你自己的域名

![image.png](https://s2.loli.net/2024/03/03/esJc2Lht97AMCyY.png)

4. 配置网站
* **配置API的反向代理**
![123](https://s2.loli.net/2024/03/03/9T81IkKZASeCaqX.png)

为静态规则

```plain
location ^~ / {
  add_header 'Access-Control-Allow-Origin' '*';
  add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
  add_header 'Access-Control-Allow-Credentials' 'true';
  add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,X-Data-Type,X-Requested-With,X-Data-Type,X-Auth-Token';
  if ( $request_method = 'OPTIONS' ) { 
    return 200;
  }
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "Upgrade";
  proxy_pass http://127.0.0.1:5544;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header REMOTE-HOST $remote_addr;
}
```

```plain
proxy_pass http://127.0.0.1:5544;
其中5544是后端运行之后的端口 如非必要不需要修改
```

* **配置resource的静态资源访问**
resource网站目录选择jar（后端程序）文件所在目录

如：我的jar目录在/www/wwwroot/api下，则我的网站目录为 /www/wwwroot/api/files/static

也就是说定位到jar文件所在的位置之后在后面加/files/static

**如无法选择或者无法定位，请自己创建对应的文件夹**

![result (2).png](https://s2.loli.net/2024/03/03/6SI5w9rt2cFLkZp.png)

* **配置backend后台访问**
后台的功能暂时只能保证基础功能管理，相关功能还在完善中。

进入该网站的目录，在文件列表上方有一个 终端 字眼 或者你也可以直接使用你自己的终端软件

在该目录下执行以下命令

```plain
git clone https://github.com/coruni/backendUi.git backend
cd backend
npm i
# 输入之后等待脚手架安装完成
```

在该网站目录进入backend的目录，就是刚才克隆下来的后台文件

修改一个名为 **.env.production**的文件

VUE_APP_BASE_API 是你的API访问地址，在上面已经配置过了

VUE_APP_API_KEY 是一个API的访问key，后面配置会讲到，建议在配置网站的时候直接配置好，后面配置API的时候填一样的就行了。

```yaml
# base api
VUE_APP_BASE_API = 'http://localhost'
# apikey
VUE_APP_API_KEY = '123456'
```
配置完成之后 确保你所在的目录有你修改的那个文件**.env.production****不要放回上一个目录**
打开终端输入

```yaml
npm run build:prod
```
等待后台生成完毕，之后会多出一个dist的文件夹，这个才是你访问的最终源码，将后台网站的目录定位到**dist**目录下
![result (1).png](https://s2.loli.net/2024/03/03/oC79YekWz1wKcA6.png)

最后已经部署完成。接下来请看后端的搭建

### 后端搭建

1. 下载jar文件
先定位的你需要放jar文件的目录，就比如我上面提到的/www/wwwroot/api文件夹

```bash
mkdir /www/wwwroot/api -r
cd /www/wwwroot/api
wget -O api.jar https://github.com/coruni/backend/releases/download/1.0.0/TypeAPi-1.0.0.jar

```
2. 创建配置文件
创建一个名为application.properties的文件，写入内容，有宝塔的用宝塔写，直接复制粘贴保存就行了，**请确保配置文件和jar文件在同一个目录下**

```plain
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
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/修改为数据库名?characterEncoding=UTF-8
spring.datasource.username=修改为数据库用户名
spring.datasource.password=修改为数据库密码
# mysql数据表前缀，如果没改过就别动
mybatis.configuration.variables.prefix=app
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
spring.mail.username=
#spring.mail.from不支持中文，需要中文，看mail.properties
spring.mail.password=
#465或者994
spring.mail.properties.mail.smtp.port: 465
spring.mail.properties.mail.smtp.ssl.enable: true
spring.mail.default-encoding=UTF-8
# 网站配置
# key为密钥，用于访问可视化配置中心,usertime为用户登录状态过期时间，以秒为单位，默认为24小时可自行设置
# contentCache,contentInfoCache,CommentCache,userCache分别是文章列表，文章信息，评论列表，用户列表的缓存时间，单位是s
webinfo.key=API的访问KEY，改为你上面配置的
webinfo.usertime=864000
webinfo.contentCache=0
webinfo.contentInfoCache=0
webinfo.CommentCache=6
webinfo.userCache=10
# 数据前缀，默认不需要修改，当同一个服务器运行多个API接口的时候，则需要设置不同的前缀，防止redis数据混淆。
web.prefix=app
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
token.secret=ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789..00
#签发人
token.issue=app
# 过期时间
token.exp = 1
```

在上面的配置中你只需要修改

```plain
spring.datasource.url
spring.datasource.username
spring.datasource.password
webinfo.key
```
如果你的redis有变化或者有密码，请自行修改这部分
```plain
spring.session.store-type=redis
spring.redis.host=127.0.0.1 #地址默认127.0.0.1
spring.redis.password= #密码 默认为0
spring.redis.port=6379 #端口 默认6379
```


3. 启动后端
在启动之前需要先安装screen这个软件，如果你不想用这个来执行后台运行，你可以选择使用其他的方法比如nohup

```bash
# Ubuntu
apt install screen -y

#centos
yum install screen -y
```

安装完成之后执行

```bash
screen -S api

# 完成之后会暂时将前台屏幕切换到后台，你可以使用Ctrl + A +D
# 来退出这个屏幕 返回前台
```

确保你执行了screen 之后还在jar 所在的目录，一切准备就绪，启动api

```bash
java -jar api.jar

# 我不知道你在上一步中下载jar文件 把文件命名为了什么，但是请记住一点
# api.jar 可以是fuckyouNvdia.jar 也可以是cnmMihoyo.jar
# 在执行java -jar 后面跟着的永远是你api文件的文件名 
# java -jar fuckyouNvdia.jar
# 如果你想限制后端的运行内存，你可以使用
# java -Xms1024M -Xmx4096M -jar api.jar
# -Xms1024M -Xmx4096M 代表最低1G 最多4G
```
当你看到这个就代表API启动完成
**Started Application in 3.31 seconds (JVM running for 5.182)**

### 安装数据库

还记得上面配置的backend吗？如果你的后端配置文件webinfo.key 与你后台配置文件 VUE_APP_API_KEY 相同的话

打开你backend.xxxxx.com，如果一切正常会跳出一个安装框，自行填写，确保每个框都不为空

![1.png](https://s2.loli.net/2024/03/03/OfTa3GCjRzomyet.png)

安装完成之后可以输入你所填的账号密码进入后台之中配置

在系统设置-》上传设置中，将CDN地址改为你上面配置的域名

```bash
http://resource.xxxxx.com/

# 如果你配置了ssl 可以将http改为https
# 注意 一定要是/结尾的
```

![1.png](https://s2.loli.net/2024/03/03/OfTa3GCjRzomyet.png)

### 配置前端

这是最后一步了，下载前端源码

[Github源码下载](https://github.com/coruni/app)


