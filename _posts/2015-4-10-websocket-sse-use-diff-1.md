---
layout: post
title: Server-Sent Events与WebSockets使用和比较（1）
categories: 前端
tags: Server-Sent-Event WebSocket
comments: true
---

上次面试腾讯实习生时被问到如何不通过Ajax发送请求（或少发送）而获得服务器数据。当时答不出来，回来之后查了一些资料，找到以下实现方法。

我们知道传统HTTP协议都是严格遵守请求-响应模型的，客户端发送一个请求，服务端返回响应报文。如果客户端不发起动作，服务器就不会有任何响应。Ajax其实是一个异步动态从服务器获取数据的方法，但它还是没有打破请求-响应的模式。听说还有Comet技术（反向Ajax），它也是建立在HTTP协议之上，它会维持一个长期存活的HTTP连接，发送“假”请求从而得到响应。在HTML5中，这种限制将被打破。下面介绍的Server-Sent Events和WebSockets就是其中的两种技术。

# Server-Sent Events

开发一个使用SSE的web应用相当容易。你需要在服务器编写一些代码来输出事件流给web应用。但是web应用处理任何其他类型的事件几乎都是相同的。

## 检测Server-Sent事件支持

> **注意**：`EventSource`并不是所有浏览器都支持。支持情况如下：
> 
> |Chrome|Firefox|IE|Opera|Safari|
> |:-----|:------|:-|:----|:-----|
> |9     |6.0    |? |11   |5     |

我们需要编写代码来检测服务器发送事件的浏览器支持情况：

{% highlight javascript linenos %}
	if(typeof(EventSource)!=="undefined") {
		// Yes! Server-sent events support!
		// Some code...
	} else {
	  	// Sorry! No server-sent events support...
	}
{% endhighlight %}

## 接收来自服务器的事件

SSE的API包含在`EventSource`接口，为了打开到服务器的连接，并开始接收来自服务器的事件，我们可以新建一个`EventSource`对象，给生成事件脚本指定一个URI，例如：

{% highlight javascript linenos %}
	var evtSource = new EventSource("/sse-servlet");
{% endhighlight %}

如果事件生成脚本被托管在一个不同的域，你应该新建一个`EventSource`对象，同时指定URI和选项字典。例如：

{% highlight javascript linenos %}
	//assuming client script is on example.com
	var evtSource = new EventSource("//api.example.com/ssedemo.php", { withCredentials: true }); 
{% endhighlight %}

一旦实例化了`EventSource`，我们就可以开始监听消息了：

{% highlight javascript linenos %}
	evtSource.onmessage = function(e) {
		var newElement = document.createElement("li");
	
		newElement.innerHTML = "message: " + e.data;
		eventList.appendChild(newElement);
	}
{% endhighlight %}

这段代码监听将要到来的消息 (这里返回的消息没有事件字段)，然后追加消息文本到HTML文档中去。

还可以使用`addEventListener()`来监听事件：

{% highlight javascript linenos %}
	evtSource.addEventListener("ping", function(e) {
	 	var newElement = document.createElement("li");
	  
	  	var obj = JSON.parse(e.data);
	  	newElement.innerHTML = "ping at " + obj.time;
		eventList.appendChild(newElement);
	}, false);
{% endhighlight %}

这段代码和上面的差不多，当服务器发送一个“ping”的事件字段时，它会被自动调用。然后解析数据字段中的JSON并且输出。

## 服务器发送事件

服务端的发送事件代码需要使用MIME类型`text/event-stream`来响应客户端。每一条信息作为一个以两个换行结束的文本块发送。

### Event Stream格式

在编写服务器端代码之前，我们先了解一下Event Stream的格式。其实它是一个简单的文本流，必须使用UTF-8进行编码。每一个消息以两个换行符分隔。一行开头的第一个字符冒号（:）作为注释，它会被忽略。

>**注意**：注释行可以用来避免连接超时，服务器可以周期性地发送注释行来维持连接。

每一个消息由一行或多行文本组成，它们列出了消息的字段。每一个字段由字段名，一个冒号（:），该字段的文本数据表示。

#### 字段

以下的字段名都是规范中定义的：

* **event**。事件的类型。如果该字段被指定，监听该事件的浏览器监听器将会被调用。浏览器可以使用`addEventListener()`来监听命名事件。如果消息的event字段没有被指定，`onmessage`处理器就会被调用。

* **data**。消息的数据字段。当`EventSource`接收到众多连续以`data:`开始的行时，会通过在每一行之间插入一个换行符来把它们连接起来。尾部的换行符会被移除掉。

* **id**。设置`EventSource`对象最后事件ID值。

* **retry**。重发事件。必须为整数，单位为毫秒。如果该值为非整数，该字段将被忽略。

除了上面的其他字段名将被忽略。

> **注意**：如果行中没有包含冒号（:），那么整行将会被当成字段名，它的字段值将会是空白字符串。

#### 例子

**只包含数据的消息**

例子中，三个消息将会被发送。第一个仅仅是一个注释，因为它以冒号（:）开始。正如上面所述，如果消息不会周期性地发送，它可以用来保持连接keep-alive。

第二个消息包含一个`data`字段，字段值为`some text`。

第三个消息包含一个`data`字段，字段值为`another message\nwith two lines`。注意换行符也在字段值里面。

	: this is a test stream
	
	data: some text
	
	data: another message
	data: with two lines

**命名事件**

这个例子发送了一些命名事件。`event`字段指定了每一个事件的名字，一个`data`字段包含了客户端需要的数据，它们是标准的JSON格式。当然了，`data`字段值可以是任何的字符串数据，不一定是JSON。
	
	event: userconnect
	data: {"username": "bobby", "time": "02:33:48"}
	
	event: usermessage
	data: {"username": "bobby", "time": "02:34:11", "text": "Hi everyone."}
	
	event: userdisconnect
	data: {"username": "bobby", "time": "02:34:23"}
	
	event: usermessage
	data: {"username": "sean", "time": "02:34:36", "text": "Bye, bobby."}

**混合**

当然了，我们不一定仅仅使用上面的一种，可以把它们混合在一个事件流中：

	event: userconnect
	data: {"username": "bobby", "time": "02:33:48"}
	
	data: Here's a system message of some kind that will get used
	data: to accomplish some task.
	
	event: usermessage
	data: {"username": "bobby", "time": "02:34:11", "text": "Hi everyone."}

了解了Event Stream的格式后，我们就可以编写服务端的代码了。我们先写一个普通的Java Servlet，web.xml文件中配置路径为“/sse-servlet”：

{% highlight java linenos %}
	import javax.servlet.ServletException;
	import javax.servlet.http.HttpServlet;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;
	import java.io.IOException;
	import java.io.PrintWriter;
	import java.util.Date;
	
	/**
	 * Created by Bill on 2015/4/10.
	 */
	public class SSEServlet extends HttpServlet {
	    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	        response.setCharacterEncoding("UTF-8");             //UTF-8编码
	        response.setHeader("Cache-Control", "no-cache");    //不缓存
	        response.setDateHeader("Expires", 0);
	        response.setContentType("text/event-stream");       //设置content-type
	
	        PrintWriter out = response.getWriter();
	        while(true) {
	            out.print(": this is a test stream\n");
	            out.print("event: ping\n");
	            out.print("data: {\"time\": \"" + new Date() + "\", \"message\": \"liangbizhi.github.io\"}");
	            out.print("\n\n");
	            out.flush();
	            try {
	                Thread.sleep(3000);
	            } catch (InterruptedException e) {
	                e.printStackTrace();
	            }
	        }
	    }
	
	    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	        doPost(request, response);
	    }
	}
{% endhighlight %}

上面的Servlet每隔3秒就会向客户端推送消息，这里为JSON格式数据。客户端浏览器代码如下：

{% highlight html linenos %}
	<body>
	    <div id="msg"></div>
	    <div id="console"></div>
	</body>
{% endhighlight %}

{% highlight javascript linenos %}
	var consoleDiv = document.getElementById("console");
    var msgDiv = document.getElementById("msg");
    if(typeof(EventSource) !== "undefined") {
      var evtSource = new EventSource("/sse-servlet");

      evtSource.addEventListener("ping", function(e){
        var obj = JSON.parse(e.data);
        appendText(msgDiv, "ping at " + obj.time + ", welcome to " + obj.message);
      }, false);

      evtSource.addEventListener("open", function(e) {
        // Connection was opened.
        appendText(consoleDiv, "Connection was opened.");
      }, false);

      evtSource.addEventListener("error", function(e) {
        if (event.readyState == EventSource.CLOSED) {
          // Connection was closed.
          appendText(consoleDiv, "Error occurred");
        }
      }, false);
    } else {
      appendText(consoleDiv, "Your browser does not support EventSource.");
    }

    function appendText(obj, text) {
      obj.innerHTML = obj.innerHTML + "<br/>"  + text;
    }
{% endhighlight %}

这段javascript代码比较简单，首先判断浏览器支不支持EventSource。如果支持则创建EventSource实例，向构造函数传入URI。然后为EventSource实例绑定了命名事件“ping”，这个就是为了响应服务器推送的ping事件了，这个名字可以自定义，但必须和服务端返回的一致。接着还有`onopen`和`onerror`事件，它们分别表示：当通往服务器的连接被打开时触发，当发生错误时触发。浏览器接收到信息后会打印到页面上。运行效果如图所示：

![运行效果](/media/images/websocket-sse-use-diff-1/sse.jpg "运行效果")

如果在IE浏览器下运行就会出现`Your browser does not support EventSource.`，因为IE浏览器并不支持`EvnetSource`。

#### 关闭事件流

默认情况下，客户端与服务器端的连接关闭了之后，连接将被重置。我们可以调用`close()`方法来关闭连接。

{% highlight javascript linenos %}
	evtSource.close();
{% endhighlight %}

下一篇，我们来看看WebSockets。

# 参考

[1] Stack Overflow [http://stackoverflow.com/questions/5195452/websockets-vs-server-sent-events-eventsource](http://stackoverflow.com/questions/5195452/websockets-vs-server-sent-events-eventsource)

[2] developer.mozilla [https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events](https://developer.mozilla.org/en-US/docs/Server-sent_events/Using_server-sent_events)

[3] w3school [http://www.w3school.com.cn/html5/html_5_serversentevents.asp](http://www.w3school.com.cn/html5/html_5_serversentevents.asp)
