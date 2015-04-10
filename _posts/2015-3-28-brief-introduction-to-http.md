---
layout: post
title: 浅谈HTTP协议
categories: 网络
tags: HTTP
comments: true
---
平常我们在浏览器输入一个网址，点击一个超链接，就能访问网页。这再简单不过了，下面就来谈谈打开网页这一过程都发生了什么。






首先介绍一下HTTP（HyperText Transfer Protocol）协议，它定义了浏览器怎样向万维网服务器请求万维网文档，以及服务器怎样把文档传送给浏览器。为应用层协议。主要特点如下：

* 面向事务（transaction oriented）。HTTP信息交换过程是一个不可分割的整体，要么所有的信息交换都完成，要么一次交换都不进行。

* 无连接。HTTP虽然使用了面向连接的TCP作为运输层协议，以保证数据的可靠传输。但HTTP协议本身是无连接的，双方在交换HTTP报文之前不需要先建立HTTP连接。

* 无状态。表示服务器不会在不同的请求之间追踪客户端的偏好。就是说，同一个客户第二次访问同一个服务器上的页面时，服务器的响应与第一次被访问时的相同。


# 1. URL

如果要访问此博客，我们就要在浏览器地址栏输入下面的地址：

	http://liangbizhi.github.io/

![http://liangbizhi.github.io/](/media/images/brief-introduction-to-http/surf.jpg "浏览器地址栏")

这就是我们最常见的HTTP方案（scheme）URL，它由几部分组成。基本格式为

	http://<host>:<port>/<path>?<query>#<frag>

1. **scheme方案**。对于HTTP来说当然是`http://`了，它告知了web客户端要使用HTTP协议访问资源。
2. **host主机**。主机名，还可以为IP地址。这里为`liangbizhi.github.io`。
3. **port端口**。服务器正在监听的网络端口。这里为默认端口80。
4. **path路径**。服务器定位资源时所需的信息。
5. **query查询字符串**。很多资源，如数据库服务，都是可以通过提问题或进行查询缩小所请求资源类型范围的。
6. **frag片段**。表示资源内部的片段。这个和锚点相似。

# 2. 连接

当我们按下回车键的时候，电脑就开始忙活了。

## 2.1 连接过程

1. 首先，我们得知道要和谁连接。没错，`liangbizhi.github.io`。我们知道HTTP使用了面向连接的TCP作为运输层协议。TCP报文首部的前2个字节需要分别写入**源端口号**和**目的端口号**。到了网络层，TCP报文作为IP数据报的数据部分，IP数据报首部需要写入**源地址**和**目的地址**。从哪里找目的地址和端口号呢？当然是分析URL了。取得主机名，然后查询DNS服务器将主机名转换为IP地址；取得端口号，默认80。第一步已经完成。
2. 浏览器与服务器建立一条TCP连接。
3. 浏览器向服务器发送一条HTTP请求报文。
4. 服务器向浏览器返回一条HTTP响应报文。
5. 关闭连接，浏览器显示文档。

## 2.2 HTTP报文

HTTP报文是简单的格式化数据块。所有的HTTP报文可以分为两类：请求报文和响应报文。请求报文会向web服务器请求一个动作。响应报文会将请求的结果返回给客户端。请求报文和响应报文的基本报文结构相同。

### 2.2.1 报文结构语法

HTTP报文由起始行、首部和实体三个部分组成。

* 起始行和首部其实就是一行一行分隔的ASCII文本。每行都以一个行终止符作为结束，它就是“\r\n”，即回车符（ASCII码13）和换行符（ASCII码10），可以写作CRLF。

* 首部则给出了一些与主体有关的信息。首部总是应该以一个空行（CRLF）结束。所以我们会发现在首部与主体之间有个空行。

* 主体是一个可选的数据块。与起始行和首部不同，主体中可以包含文本或二进制数据，也可为空。

### 2.2.2 例子

先看个例子，当我们访问这个博客首页时，浏览器（Chrome为例）发送的请求报文是什么样子的：

	GET / HTTP/1.1
	Host: liangbizhi.github.io
	Connection: keep-alive
	Cache-Control: max-age=0
	Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
	User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36
	Accept-Encoding: gzip, deflate, sdch
	Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
	Cookie: Hm_lvt_7e40c0291a48934d0bc390fc85fb36db=1424791563; Hm_lpvt_7e40c0291a48934d0bc390fc85fb36db=1426303204
	If-Modified-Since: Thu, 05 Mar 2015 14:59:08 GMT


第一行为起始行，它由三部分组成，以空格隔开。第一部分为方法，用来告知服务器要做些什么。这里的`GET`方法描述了浏览器希望以GET的方式获得服务器资源。常用的HTTP方法还有`HEAD`、`POST`、`PUT`、`TRACE`、`OPTIONS`、`DELETE`等，但并不是所有服务器都实现了它们。第二部分`/`，表示所请求资源为根目录。第三部分`HTTP/1.1`，描述了报文所使用的HTTP版本为1.1。

第二行起，为请求首部，本质上它们只是一些名/值对的列表。首部简单的语法为：名字后跟着冒号（：），然后跟上可选的空格，再跟上字段值，最后一个CRLF。现在有很多的HTTP首部，有一些是规范中定义的，还有一些是对规范的扩展。

* Host首部。为服务器提供客户端想要访问的那台机器的因特网主机名和端口号。`HTTP/1.1`要求请求中必须包含Host首部，否则服务器会以`400 Bad Request`状态码去响应。

* Connection首部。这里的值为较老的`HTTP/1.0+` keep-alive连接，`HTTP/1.1`实现为persistent连接，它们是两种类型的持久连接。但很多客户端和服务器仍然使用早期的keep-alive连接。keep-alive表示请将一条连接保持在打开状态。所谓的持久连接指的是事务处理结束后仍然保持在打开状态的TCP连接。这样可以降低网络时延和连接建立的开销（TCP三次握手），与并行连接配合使用可能是最高效的方式。在`HTTP/1.1`中持久连接是默认打开的。

* Cache-Control首部。`HTTP/1.1`较新的用于传输对象的缓存信息。max-age=0在请求中表示客户端向服务器请求确认资源是否被修改过，有的话返回200 OK，否则返回304 Not Modified。

* Accept首部。用来通知服务器客户端可以接受哪些媒体类型（MIME）。
如果客户端无法使用除了Accept列表中的对象类型，则不会去下载它们。多种类型可以用逗号（,）分隔。Accept首部字段值中还可以包含一个质量值(quality，q值)列表，分号（;）相隔，它允许客户端为每种偏好类别列出多种选项，并为每种偏好关联一个优先次序。q值优先次序从低到高取值（0.0~1.0）。上面列出的Accept首部说明Chrome最愿意接收`text/html,application/xhtml+xml,application/xml`，但`image/webp,*/*`也可以。

* User-Agent首部。用来标识客户端应用程序类型。这个首部的格式比较随意。可以是应用程序的名称，可能还会有一些描述性注释等。

* Accept-Encoding和Accept-Language首部。它们和上面的Accept首部类似，用于HTTP的内容协商。Accept-Encoding告知服务器它可以接受哪些编码方式。如果没有该首部，服务器就可以认为客户端能接受任何编码方式。`gzip`表明采用GNU zip编码；`deflate`表明采用zlib的格式压缩的；`sdch`为Chrome支持的传输压缩算法。Accept-Language通知服务器可以接受或优选哪些语言。

* Cookie首部。HTTP是无状态的，但很多情况下需要识别用户。除了某些HTTP首部可以承载用户相关的信息外，还可以使用胖URL（fat URL）和Cookie技术。Cookie中包含了一个由*名字=值*这样的信息构成的任意列表，这是通过HTTP响应的Set-Cookie或Set-Cookie2首部设置到用户身上去的，浏览器会将cookie集存储在浏览器的cookie数据库中，将来用户返回同一个站点时，浏览器就会挑出该服务器的那些cookie，在一个Cookie首部中将其传回去，这样就可以实现一个较为持久的会话了。

* If-Modified-Since首部。HTTP允许缓存（浏览器缓存或代理缓存）向原始服务器发送一个“条件GET”，请求服务器只有在文档与缓存中现有的副本不同时，才回送对象主体。HTTP定义了5个条件请求首部，都以“If-”前缀开头。其中If-Modified-Since条件请求会指示服务器：如果自指定日期后资源发生了变化，条件为true，GET就会成功执行，携带新首部的新文档会被返回给缓存，还包含了一个新的过期日期；否则条件为false，会向客户端返回一个`304 Not Modified`响应报文，但不再返回文档的实体。If-Modified-Since可以和Last-Modified响应首部配合工作。

特别地，`GET`方法是不包含主体的，所以我们只能看到起始行和首部。而`POST`方法一般包含主体，携带向服务器发送需要处理的数据。

下面为对应的响应报文：

	HTTP/1.1 304 Not Modified
	Date: Sat, 14 Mar 2015 07:50:18 GMT
	Via: 1.1 varnish
	Last-Modified: Thu, 05 Mar 2015 14:59:08 GMT
	Cache-Control: max-age=600
	Expires: Sat, 14 Mar 2015 08:00:17 GMT
	Age: 1
	Connection: keep-alive
	X-Served-By: cache-hkg6820-HKG
	X-Cache: HIT
	X-Cache-Hits: 1
	X-Timer: S1426319418.681372,VS0,VE0
	Vary: Accept-Encoding


同样地，第一行为起始行（响应行）。包含了响应报文使用的HTTP版本、数字状态码以及描述性文本短语。状态码用来告诉客户端发生了什么事情。状态码一般分为五类：

| 整体范围 | 已定义范围 | 分类			|
|:--------|:----------|:------------|
| 100~199 |	100~101	  |	信息提示 	|
| 200~299 | 200~206	  | 成功			|
| 300~399 | 300~305   | 重定向		|
| 400~499 | 400~415	  | 客户端错误	|
| 500~599 | 500~505	  | 服务器错误 	|

这里的状态码为304，这是服务器响应If-Modified-Since请求首部的结果。上面已经解释过。后面的原因短语理论上可以为任意字符串，一般取约定的有意义的值。

自第二行起就为响应首部了。我们来看看都有些什么：

* Date首部。给出了报文创建的日期和时间。响应中应包含此首部，因为缓存在评估响应的新鲜度时，要用到这个服务器认定的报文创建时间和日期。

* Via首部。在请求到达服务器的路径上，经过一个或多个代理是常见的。所谓的代理就是代表客户完成事务处理的中间人。Via首部字段列出了报文途径的每个中间节点（代理或网关）有关的信息。报文每经过一个节点，都必须将这个中间节点添加到Via列表的末尾。每个Via路标最多包含4个组件：一个可选的协议版本（没有则为默认的HTTP）、一个必须的协议版本、一个必须的节点名字（出于隐私考虑，可能为主机的假名）和一个可选的描述性注释。这里的`varnish`是一款高性能的开源HTTP加速器。

* Last-Modified首部。该实体最后一次被修改的相关信息。对于静态资源，此值可能就是服务器文件系统所提供的最后修改日期；对于动态资源，则可能就是创建响应的时间。

* Cache-Control和Expires首部。已缓存的文档过期后必须与服务器进行核对，如果被修改过，就要获取一份新鲜的副本。Expires首部和Cache-Control: max-age首部所做的事情实质上是一样的，但Cache-Control首部使用的是相对时间而不是绝对时间。max-age值定义了文档的最大使用期（以秒为单位），例子中表示自该文档生成600秒后（10分钟）就不再新鲜。而Expired则表示一个绝对日期。用Expired的日期减去Date首部日期，刚好是10分钟，与max-age的值一致。

* Age首部。告诉接收端响应已产生了多长时间（以秒为单位）。

* Connection首部。以上面的请求首部Connection对应，如果服务器愿意为其请求将连接保持在打开状态，就在响应中包含相同的首部。如果响应中没有`Connection: keep-alive`首部，客服端就会认为服务器不支持keep-alive，会在接受到响应报文之后关闭连接。

* X-扩展首部。它们是非标准的首部，由应用程序开发者创建，还未添加到已批准的HTTP规范中去。

* Vary首部。它列出了客户端请求首部，服务器可用这些首部来选择文档或产生定制的内容。例子的值为Accept-Encoding，所以服务器会返回一个压缩的报文。

因为响应状态为304 Not Modified，所以这里并没有实体内容。

上面只是一个例子，只涉及到一部分HTTP首部和简单的介绍。更多内容可查阅相关资料。

## 2.3 细节优化

实际上，人们总是希望网页打开得越快越好——没人愿意等待一个大半天也打不开的网站。在这个互联网爆炸的年代，各种性能优化的重要性不言而喻。

### 2.3.1 DNS优化

域名解析时，为了获得IP地址需要和大量的DNS服务器通信。这是极耗费时间的。对于DNS优化，缓存是最简单和效果明显的。缓存层级：

* 浏览器DNS缓存。
* 系统DNS缓存。
* Hosts文件。
* 各个DNS服务器上的缓存。

DNS缓存失效期通常较短，很多情况下都要重取。所以预取是个不错的方法。比如敲击某个网址时，浏览器根据历史发现你很可能去访问哪个网站，就提前给你做DNS预取了。比如敲了一个“w”时，浏览器已经帮你去找weibo.com的IP地址了。

### 2.3.2 TCP优化

HTTP/1.1允许在事务处理结束后将TCP连接保持在打开状态（持久连接），以便为未来的HTTP请求重用现存的连接，这样就可以避免耗时较长的TCP三次握手连接建立时间了。作为进一步优化，我们顺着刚才的DNS优化步骤再建立连接就好了。所以敲完第一个字母的时候，DNS解析完了就去建立连接了。这样也可以减少用户等待时间。

### 2.3.3 HTTP传输优化

HTTP允许客户端打开多条连接，并行地执行多个HTTP事务。这可能会提高页面加载速度，但不一定更快。客户端的带宽不足，打开大量连接会消耗很多内存资源等。所以我们又要用到缓存了，缓存层次结构如下：

* PageCache。这个最快，直接在内存中缓存了现有网页的DOM结构和渲染结果，这就是为什么点前进、后退的时候会这么快的原因。
* HTTP Cache。文件级别，按照RFC2616缓存到本地的文件系统上。
* 代理Cache。如果通过代理服务器上网，代理服务器通常也会按照缓存标准去缓存。
* CDN。地理上离你较近的内容服务器。取得资源的距离更近。
* DMOC（distributed memory object caching system）。CDN主要存放的是静态数据，但是网页中通常有很多动态的数据需要查询数据库，流量多了压力就会很大，通常服务器外围还会有一层内存缓存服务器，专门缓存这些数据库中的对象。

另一个HTTP常用的优化就是压缩了。报文越小，网络传输时间也就少了。大部分服务器都会对HTTP消息进行gzip压缩。这个可以通过报文首部（header）中看到。

# 3. 极简单Web服务器

了解了基本的HTTP原理，我们可以自己写一个简单的服务器来玩玩，此程序默认会打开8080端口来监听请求连接。当接收到请求报文后程序将直接打印请求报文到控制台；接着我们还可以按照HTTP协议格式发送响应报文给客户端。还行吧^_^。

{% highlight java linenos %}

	import java.io.*;
	import java.net.ServerSocket;
	import java.net.Socket;
	import java.net.InetAddress;
	import java.util.Scanner;
	import java.util.Date;

	public class SimpleWebServer {
	    public static void main(String[] args) {
	        int port = args.length > 0 ? Integer.valueOf(args[0]) : 8080;

	        ServerSocket serverSocket = null;
	        try {
	            serverSocket = new ServerSocket(port);
	            System.out.println("服务器成功启动！\t" + new Date());
	        } catch (IOException e) {
	            System.out.println("服务器启动失败！端口" + port + "正在使用！");
	            System.exit(0);
	        }

	        while(true) {
	            try {
	            	System.out.println("正在监听端口" + port + "...\t" + new Date());
	                Socket socket = serverSocket.accept();
	                InetAddress cname = socket.getInetAddress();
	                System.out.println("-->\t请求来自 " + cname.getHostAddress() + "\t" + new Date());

	                InputStream inputStream = socket.getInputStream();
	                int code = 0;
	                int count = 0;
	                while ((code = inputStream.read()) != -1) {
	                    System.out.print((char) code);
	                    if (code == 13) count++;
	                    else if (code == 10) count++;
	                    else count = 0;
	                    if (count == 4) break;
	                }
	                String line = "";
	                System.out.println("<--\t输入响应报文（以单行.号结束输入）" + new Date() + "：");
	                OutputStream outputStream = socket.getOutputStream();
	                PrintWriter printWriter = new PrintWriter(outputStream);
	                Scanner outputScanner = new Scanner(System.in);
	                StringBuilder msg = new StringBuilder();
	                while (!(line = outputScanner.nextLine()).equals(".")) {
	                    msg.append(line + "\r\n");
	                }
	                printWriter.write(msg.toString());
	                printWriter.flush();
	                socket.close();
	                System.out.println("<--响应报文发送成功！\t" + new Date());
	            } catch (IOException e) {
	                e.printStackTrace();
	            }
	        }
	    }
	}

{% endhighlight %}

用如下命令运行程序，运行结果如下图：

	javac -encoding utf-8 SimpleWebServer.java
	java SimpleWebServer

![服务器启动](/media/images/brief-introduction-to-http/server-start.jpg "服务器启动")

好，万事俱备只欠请求报文了。我们可以使用浏览器发送请求。在浏览器中输入如下URL：

	http://localhost:8080/

我们的服务器马上就接收到了请求报文，如下图所示。这是浏览器的标签页正在打圈加载中，因为我们的服务器还没有发送响应报文呢。


![浏览器等待响应](/media/images/brief-introduction-to-http/loading.jpg "浏览器等待响应")

![服务器接收请求](/media/images/brief-introduction-to-http/request.jpg "服务器接收请求")

好了，服务器真期待我们输入响应报文呢，我们马上按照HTTP协议规范输入响应报文吧，看看浏览器会不会接收得到。注意首部和实体之间要有一个空行哦（CRLF）。这里我特意把200状态码的原因描述短语改为了自定义的Your response msg here，为了验证上面提过的内容哦。（我这里规定单行点号“.”作为报文输入结束标记）。

![服务器发送响应](/media/images/brief-introduction-to-http/response.jpg "服务器发送响应")

看，我们的浏览器的确接收了响应了，F12看看，一切正常。

![浏览器接收响应](/media/images/brief-introduction-to-http/browser-response.jpg "浏览器接收响应")

当然，我们还可以尝试一下其他的状态码，比如3xx重定向转态，同时提供Location响应首部，看看浏览器会不会跳转等等。

# 4. 参考文献

[1] David Gourley 等著，陈涓 等译；HTTP权威指南 （HTTP:The Definitive Guide）；人民邮电出版社，2012

[2] 谢希仁 编著；计算机网络（第五版）；电子工业出版社；2012

[3] 某安度博客（出处有待考证）
