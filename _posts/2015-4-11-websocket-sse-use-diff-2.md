---
layout: post
title: Server-Sent Events与WebSockets使用和比较（2）
categories: 前端
tags: Server-Sent-Event WebSocket 翻译
comments: true
---

# WebSocket

WebSocket是HTML5开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。在WebSocket API中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

## 优点

1. 首部（Header）信息很小，大概只有2字节。（早期版本7.0）
2. 服务器可以主动向客户端推送数据。

## 编写WebSocket客户端程序

### 创建WebSocket对象

为了使用WebSocket协议进行通信，我们需要创建一个`WebSocket`对象，它会自动打开与服务器的连接。`WebSocket`构造器接收一个必选和一个可选的参数：

{% highlight javascript linenos %}
	WebSocket WebSocket(
	  in DOMString url,
	  in optional DOMString protocols
	);
{% endhighlight %}

**url**。连接的URI。

**protocols** (可选)。一个协议字符串或者一个协议字符串数组。这些字符串用来指示子协议，所以一个单独的服务器就可以实现多种WebSocket子协议（例如，你想服务器根据指定的协议来处理不同类型的内部交互）。如果没有指定，则为空字符串。

该构造器可能抛出异常：

**SECURITY_ERR**。连接的端口被堵塞。

### 连接出错

如果连接过程中出现错误，首先一个`error`事件将会发送给WebSocket对象（即调用它的`onerror`方法），然后WebSocket将接收到`CloseEvent`对象（即调用WebSocket的`onclose`方法），`CloseEvent`对象指名了连接关闭的原因。

{% highlight javascript linenos %}
	ws.onclose = function(event) {
		console.log("WebSocketClosed!");
	};
	
	ws.onerror = function(event) {
		console.log("WebSocketError!");
	};
{% endhighlight %}

### 例子

这个简单的例子中创建了一个新的WebSocket对象，连接到ws://www.example.com/socketserver。自定义了一个“protocolOne”的请求协议。

{% highlight javascript linenos %}
	var exampleSocket = new WebSocket("ws://www.example.com/socketserver", "protocolOne");
{% endhighlight %}

返回时，`exampleSocket.readyState`的值为`CONNECTING`。一旦连接准备传输数据，`readyState`值将会变为`OPEN`。

如果想打开一个自由的协议支持的连接，可以指定一个协议数组：

{% highlight javascript linenos %}
	var exampleSocket = new WebSocket("ws://www.example.com/socketserver", ["protocolOne", "protocolTwo"]);
{% endhighlight %}

连接一旦建立（即`readyState`的值为`OPEN`）,`exampleSocket.protocol`会告诉我们服务器选择了哪一个协议。

上面的例子中，`ws`（scheme）代替了`http`，类似地，`wss`将代替`https`。建立一个WebSocket依赖于HTTP Upgrade机制，所以当我们请求 ws://www.example.com 或者 wss://www.example.com 这样的服务器时，将隐式地请求协议升级。

### 发送数据给服务器

连接一旦打开，我们就可以向服务器传输数据了。调用`WebSocket`对象的`send()`方法即可：

{% highlight javascript linenos %}
	exampleSocket.send("Here's some text that the server is urgently awaiting!");
{% endhighlight %}

我们可以发送字符串、`Blob`或`ArrayBuffer`数据。

因为建立连接是异步的，在创建WebSocket对象后马上调用`send()`方法不一定会成功。所以我们最好在`onopen`方法里执行发送操作：

{% highlight javascript linenos %}
	exampleSocket.onopen = function (event) {
		exampleSocket.send("Here's some text that the server is urgently awaiting!"); 
	};
{% endhighlight %}

另外你可以方便地通过JSON发送一些复杂的数据给服务器。例如，一个聊天程序可以使用实现了JSON数据封装的协议与服务器交互：

{% highlight javascript linenos %}
	// Send text to all users through the server
	function sendText() {
		// Construct a msg object containing the data the server needs to process the message from the chat client.
		var msg = {
	 		type: "message",
	    	text: document.getElementById("text").value,
	    	id:   clientID,
	    	date: Date.now()
	  	};
	
	  	// Send the msg object as a JSON-formatted string.
	  	exampleSocket.send(JSON.stringify(msg));
	  
	  	// Blank the text input element, ready to receive the next line of text from the user.
	  	document.getElementById("text").value = "";
	  }
{% endhighlight %}

### 接收服务器数据

WebSocket是一个事件驱动API。当接收到了消息，一个`message`事件将会传递给`onmessage`函数。为了监听新到来的数据，我们可以这样做：

{% highlight javascript linenos %}
	exampleSocket.onmessage = function (event) {
	  	console.log(event.data);
	}
{% endhighlight %}

让我们来考虑一下上面提到的聊天程序。客户端可能会接收到五花八门的数据包，比如：

* 登陆握手数据包
* 消息文本数据包
* 用户列表更新数据包

所以解析这些数据的代码可能会是这样的：

{% highlight javascript linenos %}
	exampleSocket.onmessage = function(event) {
	  var f = document.getElementById("chatbox").contentDocument;
	  var text = "";
	  var msg = JSON.parse(event.data);
	  var time = new Date(msg.date);
	  var timeStr = time.toLocaleTimeString();
	  
	  switch(msg.type) {
	    case "id":
	      clientID = msg.id;
	      setUsername();
	      break;
	    case "username":
	      text = "<b>User <em>" + msg.name + "</em> signed in at " + timeStr + "</b><br>";
	      break;
	    case "message":
	      text = "(" + timeStr + ") <b>" + msg.name + "</b>: " + msg.text + "<br>";
	      break;
	    case "rejectusername":
	      text = "<b>Your username has been set to <em>" + msg.name + "</em> because the name you chose is in use.</b><br>"
	      break;
	    case "userlist":
	      var ul = "";
	      for (i=0; i < msg.users.length; i++) {
	        ul += msg.users[i] + "<br>";
	      }
	      document.getElementById("userlistbox").innerHTML = ul;
	      break;
	  }
	  
	  if (text.length) {
	    f.write(text);
	    document.getElementById("chatbox").contentWindow.scrollByPages(1);
	  }
	};
{% endhighlight %}

这里我们使用了`JSON.parse()`来把JSON对象转换为原始对象，然后进行操作。

通过WebSocket接收到的文本编码为UTF-8。

### 关闭连接

当使用完WebSocket连接后，调用`close()`方法以关闭资源：

{% highlight javascript linenos %}
	exampleSocket.close();
{% endhighlight %}

在关闭之前检验一下socket的`bufferedAmount`属性以确定是否还有数据在网络上传输是很有帮助的。

### WebSocket服务器

实现了WebSocket协议的服务器还是挺多的，比如tomcat、node.js等，有兴趣的可以编写一下服务器端的代码。

# 两者的比较

WebSockets和Server-Sent Events（详见上一篇文章）都可以向浏览器推送数据，然而他们并不是相互竞争的技术。

WebSockets连接可以同时发送数据给浏览器，也可以接收来自浏览器的数据。一个可能使用WebSockets的例子就是聊天程序了。

SSE连接仅仅可以推送数据给浏览器。在线股票行情，或者twitter更新都是比较好的例子，它们都可以使用SSE。

实践中，由于SSE可以做的WebSockets都可以做，所以WebSockets正获得更多的关注和青睐，浏览器支持WebSockets更多于SSE。

然而，这对于一些应用来说有点矫枉过正了，并且后端可以更容易实现SSE。

而且SSE在较老的那些不支持该特性的浏览器中更容易实现，仅仅是使用JavaScript。

SSE之所以会被WebSockets掩盖了光芒的原因之一是WebSockets API提供了丰富的协议去处理双向的，全双工的通信。因为WebSockets拥有两个信道，所以它对于游戏、聊天app和那些需要双方实时更新的应用更具有吸引力。然而，在某些场景中，客户端不需要发送数据。我们只是简单地获取服务器的更新数据。例如朋友状态的更新、股票代号、新闻提要更新或者其他一些自动数据推送机制。如果需要向服务器发送数据，使用XMLHttpRequest是个好办法。

SSE工作在传统的HTTP协议上，也就是说它不需要一个特定的协议或者服务器实现来支持。而WebSockets需要全双工连接和新的Web Socket服务器来处理此协议。另外，SSE还有很多WebSockets缺少的特点，比如自动重连，事件ID和发送任意事件的能力。

# 总结

SSE相对于WebSockets的优点：

* 使用简单的HTTP传输，而不是自定义的协议。
* SSE可以通过javascript在那些不支持它的浏览器上面实现。
* 内置支持重连和事件ID。
* 更简单的协议。

WebSockets相对于SSE的优点：

* 实时，双向通信。
* 更多的浏览器本地支持。

一些使用SSE的理想情况：

* 股票行情。
* twitter信息更新。
* 浏览器提醒。

# 参考

[1] Stack Overflow [http://stackoverflow.com/questions/5195452/websockets-vs-server-sent-events-eventsource](http://stackoverflow.com/questions/5195452/websockets-vs-server-sent-events-eventsource)

[2] developer.mozilla.org [https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications](https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications "developer.mozilla.org")