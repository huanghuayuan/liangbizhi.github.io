---
layout: post
title: HttpClient4.3.x第一章入门教程
category: Java
comments: true
---
最近想写[一个网络爬虫](https://github.com/liangbizhi/WebCrawler "Github")，要用到apache的httpclient项目（HttpClient4.3.x），在官网学习该项目一些基础内容，顺便翻译[官方文档](http://hc.apache.org/httpcomponents-client-4.3.x/tutorial/html/fundamentals.html "跳转")。






# 第一章 基础

## 1.1. 请求处理

HttpClient最重要的功能是处理HTTP方法。一个HTTP方法涉及一个或几个HTTP请求或HTTP响应的交换，通常被HttpClient内部处理。用户提供一个请求对象，HttpClient将它传送给目标服务器并返回一个对应的响应对象，如果处理过程失败，则抛出异常。

通常，HttpClient API的主要入口是HttpClient接口，它定义了上面的协议。

这里是一个请求处理过程例子：

    CloseableHttpClient httpclient = HttpClients.createDefault();
    HttpGet httpget = new HttpGet("http://localhost/");
    CloseableHttpResponse response = httpclient.execute(httpget);
    try {
        <...>
    } finally {
        response.close();
    }

### 1.1.1. HTTP请求

所有的HTTP请求都有一个请求行（request line），包括一个方法名，一个请求URI和一个HTTP协议版本号。

HttpClient支持所有`HTTP/1.1`定义的方法，包括：`GET`，`HEAD`，`POST`，`PUT`，`DELETE`，`TRACE` 和 `OPTION`。每一个方法都对应了一个指定的类：`HttpGet`，`HttpPost`，`HttpHead`，`HttpPost`，`HttpPut`，`HttpDelete`，`HttpTrace`和`HttpOption`。

请求URI是一个统一资源标记符，标记了请求的资源。HTTP请求`URIs`包含了请求协议，主机名，端号（可选），资源路径，查询字符串（可选）和片信息（可选）。

        HttpGet httpget = new HttpGet("http://www.google.com/search?hl=en&q=httpclient&btnG=Google+Search&aq=f&oq=");
        
HttpClient提供了`URIBuilder`工具类来简化请求`URIs`的创建和修改。

    URI uri = new URIBuilder()
        .setScheme("http")
        .setHost("www.google.com")
        .setPath("/search")
        .setParameter("q", "httpclient")
        .setParameter("btnG", "Google Search")
        .setParameter("aq", "f")
        .setParameter("oq", "")
        .build();
    HttpGet httpget = new HttpGet(uri);
    System.out.println(httpget.getURI());
    
标准输出：

    http://www.google.com/search?q=httpclient&btnG=Google+Search&aq=f&oq=

### 1.1.2. HTTP响应

HTTP响应是服务器接收并解析请求消息后返回给客户端的消息。该消息的第一行包含了协议版本（后面紧跟着一个数字状态码）和关联的文本短语。

    HttpResponse response = new BasicHttpResponse(HttpVersion.HTTP_1_1, HttpStatus.SC_OK, "OK");

    System.out.println(response.getProtocolVersion());
    System.out.println(response.getStatusLine().getStatusCode());
    System.out.println(response.getStatusLine().getReasonPhrase());
    System.out.println(response.getStatusLine().toString());
    
标准输出：

    HTTP/1.1
    200
    OK
    HTTP/1.1 200 OK
    
### 1.1.3. 消息头

一个HTTP消息可以包含许多消息头，它们用来描述消息的属性，比如消息的内容，类型等。HttpClient提供方法来获取、增加、移除和枚举消息头。

    HttpResponse response = new BasicHttpResponse(HttpVersion.HTTP_1_1,HttpStatus.SC_OK, "OK");
    response.addHeader("Set-Cookie", "c1=a; path=/; domain=localhost");
    response.addHeader("Set-Cookie", "c2=b; path=\"/\", c3=c; domain=\"localhost\"");
    
    Header h1 = response.getFirstHeader("Set-Cookie");  //第一个消息头
    System.out.println(h1);
    Header h2 = response.getLastHeader("Set-Cookie");
    System.out.println(h2);
    Header[] hs = response.getHeaders("Set-Cookie");
    System.out.println(hs.length);

标准输出：

    Set-Cookie: c1=a; path=/; domain=localhost
    Set-Cookie: c2=b; path="/", c3=c; domain="localhost"
    2
    
获取所有的消息头最有效的方法是使用`HeaderIterator`接口。

    HttpResponse response = new BasicHttpResponse(HttpVersion.HTTP_1_1, HttpStatus.SC_OK, "OK");
    response.addHeader("Set-Cookie", "c1=a; path=/; domain=localhost");
    response.addHeader("Set-Cookie", "c2=b; path=\"/\", c3=c; domain=\"localhost\"");

    HeaderIterator it = response.headerIterator("Set-Cookie");

    while (it.hasNext()) {
        System.out.println(it.next());
    }

标准输出：

    Set-Cookie: c1=a; path=/; domain=localhost
    Set-Cookie: c2=b; path="/", c3=c; domain="localhost"
    
它同时提供了方便的方法，把HTTP消息解析成独立的消息头元素。

    HttpResponse response = new BasicHttpResponse(HttpVersion.HTTP_1_1, HttpStatus.SC_OK, "OK");
    response.addHeader("Set-Cookie", "c1=a; path=/; domain=localhost");
    response.addHeader("Set-Cookie", "c2=b; path=\"/\", c3=c; domain=\"localhost\"");

    HeaderElementIterator it = new BasicHeaderElementIterator(response.headerIterator("Set-Cookie"));

    while (it.hasNext()) {
        HeaderElement elem = it.nextElement(); 
        System.out.println(elem.getName() + " = " + elem.getValue());
        NameValuePair[] params = elem.getParameters();
        for (int i = 0; i < params.length; i++) {
            System.out.println(" " + params[i]);
        }
    }
    
标准输出：

    c1 = a
    path=/
    domain=localhost
    c2 = b
    path=/
    c3 = c
    domain=localhost
    
### 1.1.4. HTTP实体

HTTP消息可以携带与请求或响应相关的内容实体。实体可以出现在某些请求和某些响应中，但不是必须的。使用了实体的请求被称为“实体封装请求(entity enclosing requests)”。HTTP协议定义了两个实体封装请求方法：`POST`和`PUT`。响应一般封装了内容实体。这个规则也存在异常，比如对`HEAD`方法的响应，和`204 No Content`，`304 Not Modified`，`205 Reset Content`响应。

根据它们的内容来源，HttpClient区分三种实体：

* **streamed（流）:** 内容通过流接收，或者实时生成（generated on the fly）。特别地，streamed包含了从HTTP响应接收到的实体。streamed实体一般是不可重复的。

* **self-contained（独立的）:** 内容可能在内存中，或者通过与某一连接或其他实体独立的方式获得。self-contained实体一般是可重复的。这种类型的实体常常用来封装HTTP请求。

* **wrapping（封装）:** 其内容从其他实体中获取。

当从HTTP响应读取内容时，为了连接管理，上面这些区分是很重要的。对于那些由一个应用程序创建的，并仅仅使用HttpClient发送的实体，streamed类实体和self-contained类实体之间的区别并不重要。这种情况下，streamed被认为是不可重复的，self-contained则是可重复的。

#### 1.1.4.1. 可重复实体

实体可重复，意味着它的内容可以被读多次。这仅仅对于self-contained实体可行（比如`ByteArrayEntity` 或者 `StringEntity`）。

#### 1.1.4.2. 使用HTTP实体

因为一个实体可同时代表二进制和文本内容，所以它支持文本编码（支持字母内容等）。

当处理一个封装内容的请求或当请求成功并有响应返回客户端时，实体就被创建。

为了读取实体中的内容，要么通过`HttpEntity#getContent()`方法获得输入流，该方法返回的是`java.io.InputStream`对象；要么给`HttpEntity#writeTo(OutputStream)`方法提供一个输出流对象，当所有的内容都被写到给定的输出流时，这个方法会马上返回。

当实体随传入的消息被接收时，可以用`HttpEntity#getContentType()`和`HttpEntity#getContentLength()`方法来读取通用元数据，比如`Content-Type`和`Content-Length`头信息（如果它们可用的话）。因为`Content-Type`头可以包含一个文本`MIME`类型比如`text/plain`或`text/html`的字符编码，所以可以用`HttpEntity#getContentEncoding()`方法来获取这个编码信息。如果这些头消息不可用，会返回长度-1，或返回`NULL`（对于`Content-type`）。如果`Content-Type`头可用，则返回一个`Header`对象。

当为发送消息创建一个实体时，实体创建器必须提供这些元数据。

	StringEntity myEntity = new StringEntity("important message", 
	   ContentType.create("text/plain", "UTF-8"));
	
	System.out.println(myEntity.getContentType());
	System.out.println(myEntity.getContentLength());
	System.out.println(EntityUtils.toString(myEntity));
	System.out.println(EntityUtils.toByteArray(myEntity).length);

标准输出：

	Content-Type: text/plain; charset=utf-8
	17
	important message
	17

### 1.1.5. 保证低级资源的释放

为了保证系统资源的适当释放，我们必须关闭与实体相关的内容流，或者关闭响应本身。

	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet("http://localhost/");
	CloseableHttpResponse response = httpclient.execute(httpget);
	try {
	    HttpEntity entity = response.getEntity();
	    if (entity != null) {
	        InputStream instream = entity.getContent();
	        try {
	            // do something useful
	        } finally {
	            instream.close();
	        }
	    }
	} finally {
	    response.close();
	}

关闭内容流和关闭响应，它们的区别就是前者会试图通过消耗实体内容来保持底层的连接，而后者会马上关闭并且断开连接。

请注意，一旦实体被完全写出，`HttpEntity#writeTo(OutputStream)`方法也要保证释放系统资源。如果调用`HttpEntity#getContent()`获得一个`java.io.InputStream`流对象，也最好在`finally`语句中关闭掉这个流。

当使用流实体时，可以使用`EntityUtils#consume(HttpEntity)`方法来保证实体内容已被完全消耗完和底层流已被关闭掉。

然而有些情况，当只想接受响应内容的一小部分时，在处理剩下的内容时会造成性能损失，并使得连接重用太高，此时我们可以关闭响应来终止内容流。

	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet("http://localhost/");
	CloseableHttpResponse response = httpclient.execute(httpget);
	try {
	    HttpEntity entity = response.getEntity();
	    if (entity != null) {
	        InputStream instream = entity.getContent();
	        int byteOne = instream.read();
	        int byteTwo = instream.read();
	        // Do not need the rest
	    }
	} finally {
	    response.close();
	}

这个连接不会被重用，但是它持有的所有级别的资源都会被正确地释放掉。

### 1.1.6. 消耗实体内容

推荐使用实体的`HttpEntity#getContent()`或`HttpEntity#writeTo(OutputStream)`方法来消耗它的内容。HttpClient也提供了EntityUtils 类，它提供了几个静态方法以更简单地读取实体的内容或信息。除了直接读取`java.io.InputStream`外，我们可以使用这个类的方法，以字符串或字节数组的方式获取实体的全部内容。而然，强烈地不鼓励使用`EntityUtils`，除非响应实体来源于可信任的HTTP服务器并且是有限长度的。

	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet("http://localhost/");
	CloseableHttpResponse response = httpclient.execute(httpget);
	try {
	    HttpEntity entity = response.getEntity();
	    if (entity != null) {
	        long len = entity.getContentLength();
	        if (len != -1 && len < 2048) {
	            System.out.println(EntityUtils.toString(entity));
	        } else {
	            // Stream content out
	        }
	    }
	} finally {
	    response.close();
	}

在某些情况下，需要能多次读取实体内容。此时实体内容必须经过某些方式缓存起来，要么在内存中，要么在磁盘上。最简单的实现方法是使用`BufferedHttpEntity`类来封装原实体。这将会使得原实体内容被读入内存缓冲区中。后面我们将可以重复读取封装器里面的内容。
	
	CloseableHttpResponse response = <...>
	HttpEntity entity = response.getEntity();
	if (entity != null) {
	    entity = new BufferedHttpEntity(entity);
	}

### 1.1.7. 创建实体内容

HttpClient提供了几个类，通过HTTP连接使用它们可以高效地输出实体内容。这些类的实例被实体封装请求（如`POST`和`PUT`）关联起来。HttpClient为大多数的通用数据容器（如字符串，字节数组，输入流和文件）提供了几个类：`StringEntity`，`ByteArrayEntity`，`InputStreamEntity`和`FileEntity`。

	File file = new File("somefile.txt");
	FileEntity entity = new FileEntity(file, 
	    ContentType.create("text/plain", "UTF-8"));        
	
	HttpPost httppost = new HttpPost("http://localhost/action.do");
	httppost.setEntity(entity);

请注意，`InputStreamEntity`是不可重复的，因为它仅可以从底层数据流读取一次。通常推荐实现一个自定义的、独立的`HttpEntity`类，而不是使用一般的`InputStreamEntity`。`FileEntity`可以是一个很好的起点。

#### 1.1.7.1. HTML表单

许多应用需要模拟提交HTML表单的过程，例如，为了登陆一个web应用或者提交输入的数据。HttpClient提供了实体类`UrlEncodedFormEntity`以方便处理该过程。

	List<NameValuePair> formparams = new ArrayList<NameValuePair>();
	formparams.add(new BasicNameValuePair("param1", "value1"));
	formparams.add(new BasicNameValuePair("param2", "value2"));
	UrlEncodedFormEntity entity = new UrlEncodedFormEntity(formparams, Consts.UTF_8);
	HttpPost httppost = new HttpPost("http://localhost/handler.do");
	httppost.setEntity(entity);

`UrlEncodedFormEntity`实例将会使用URL encoding来编码参数，产生以下内容：

	param1=value1&param2=value2

#### 1.1.7.2. 内容分块

基于传送的HTTP消息属性，通常推荐由HttpClient来选择最合适的传送编码。然而，有时候通过设置`HttpEntity#setChunked()`为`true`，通知HttpClient使用块编码更好。请注意HttpClient将仅仅使用此标记作为一个暗示。当使用的HTTP协议版本不支持块编码时，例如HTTP/1.0，那么这个值就会被忽略。

	StringEntity entity = new StringEntity("important message",
	        ContentType.create("plain/text", Consts.UTF_8));
	entity.setChunked(true);
	HttpPost httppost = new HttpPost("http://localhost/acrtion.do");
	httppost.setEntity(entity);

### 1.1.8. 响应处理程序

使用`ResponseHandler`接口是处理响应最简单、最方便的方式，该接口包含了`handleResponse(HttpResponse response)`方法。这个方法使得用户完全不用关心底层连接管理。使用`ResponseHandler`时，无论请求处理成功或出现异常，HttpClient都将会自动保证连接的释放。

	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpGet httpget = new HttpGet("http://localhost/json");
	
	ResponseHandler<MyJsonObject> rh = new ResponseHandler<MyJsonObject>() {
	
	    @Override
	    public JsonObject handleResponse(
	            final HttpResponse response) throws IOException {
	        StatusLine statusLine = response.getStatusLine();
	        HttpEntity entity = response.getEntity();
	        if (statusLine.getStatusCode() >= 300) {
	            throw new HttpResponseException(
	                    statusLine.getStatusCode(),
	                    statusLine.getReasonPhrase());
	        }
	        if (entity == null) {
	            throw new ClientProtocolException("Response contains no content");
	        }
	        Gson gson = new GsonBuilder().create();
	        ContentType contentType = ContentType.getOrDefault(entity);
	        Charset charset = contentType.getCharset();
	        Reader reader = new InputStreamReader(entity.getContent(), charset);
	        return gson.fromJson(reader, MyJsonObject.class);
	    }
	};
	MyJsonObject myjson = client.execute(httpget, rh);

## 1.2. HttpClient接口

HttpClient接口代表了大部分重要的HTTP请求处理规则。它规定了不受限制的或具体细节的请求处理过程，而且隐藏了连接管理，状态管理，授权和重定向处理个人实现等的细节。这使得更容易使用额外的功能，例如响应内容缓存，来修饰接口。对于一些专用处理程序或负责处理HTTP协议某具体方面（如重定向、授权管理或决定连接持续时间）的策略接口实现，HttpClient实现一般情况下都充当着一个幌子（facade）。

	ConnectionKeepAliveStrategy keepAliveStrat = new DefaultConnectionKeepAliveStrategy() {
	
	    @Override
	    public long getKeepAliveDuration(
	            HttpResponse response,
	            HttpContext context) {
	        long keepAlive = super.getKeepAliveDuration(response, context);
	        if (keepAlive == -1) {
	            // Keep connections alive 5 seconds if a keep-alive value
	            // has not be explicitly set by the server
	            keepAlive = 5000;
	        }
	        return keepAlive;
	    }
	
	};
	CloseableHttpClient httpclient = HttpClients.custom()
	        .setKeepAliveStrategy(keepAliveStrat)
	        .build();

### 1.2.1. HttpClient线程安全

HttpClient实现是线程安全的。推荐使用这个类的同一实例来处理请求。

### 1.2.2. HttpClient资源分配

当一个`CloseableHttpClient`实例不再需要并将要超出与之关联的连接管理程序范围时，必须通过`CloseableHttpClient#close()`方法关闭它。

	CloseableHttpClient httpclient = HttpClients.createDefault();
	try {
	    <...>
	} finally {
	    httpclient.close();
	}

## 1.3. HTTP执行上下文

起初，HTTP被设计为一个无状态，面向响应-请求的协议。然而，现实情况下，应用程序经常需要能在几次逻辑相关的请求-响应交换中保持状态信息。为了使应用程序能维持一个处理状态，HttpClient允许HTTP请求在一个具体的执行上下文中执行，简称HTTP上下文。如果同样的上下文在持续的请求之间重复使用，多个逻辑相关的请求就可以参与同一个逻辑会话。HTTP上下文函数和`java.util.Map<String, Object>`相似。这是一个简单的任意指定值的集合。一个应用程序可以在请求执行或执行完成之后检查上下文之前填充上下文属性。

由于`HttpContext`可以包含任意的对象，所以在多个线程之间共享上下文可能不安全。推荐每个执行线程都维护自己的上下文。

在HTTP请求执行过程中，HttpClient添加一下属性到执行上下文中：

* `HttpConnection`实例，表示与目标服务器的实际连接。
* `HttpHost`实例，表示连接目标。
* `HttpRoute`实例，表示完整的连接路由。
* `HttpRequest`实例，表示实际的HTTP请求。
* `HttpResponse`实例，表示实际的HTTP响应。
* `java.lang.Boolean`对象表示标记实际请求是否已经完全传送到了连接目标。
* `RequestConfig`对象表示实际的请求配置。
* `java.util.List<URI>`对象表示所有在执行请求过程中得到的重定向位置的一个集合。

可以使用`HttpClientContext`适配器类来简化上下文状态的相互作用。

	HttpContext context = <...>
	HttpClientContext clientContext = HttpClientContext.adapt(context);
	HttpHost target = clientContext.getTargetHost();
	HttpRequest request = clientContext.getRequest();
	HttpResponse response = clientContext.getResponse();
	RequestConfig config = clientContext.getRequestConfig();

为了保证会话上下文和请求之间状态信息的自动传播，表示一个逻辑相关的会话的多个请求序列应被同一个`HttpContext`实例执行。

下面的例子里，被初始请求设置的请求配置将会保存在执行上下文中，通过共享同一个上下文，请求配置还被传播到多个连续的请求中。

	CloseableHttpClient httpclient = HttpClients.createDefault();
	RequestConfig requestConfig = RequestConfig.custom()
	        .setSocketTimeout(1000)
	        .setConnectTimeout(1000)
	        .build();
	
	HttpGet httpget1 = new HttpGet("http://localhost/1");
	httpget1.setConfig(requestConfig);
	CloseableHttpResponse response1 = httpclient.execute(httpget1, context);
	try {
	    HttpEntity entity1 = response1.getEntity();
	} finally {
	    response1.close();
	}
	HttpGet httpget2 = new HttpGet("http://localhost/2");
	CloseableHttpResponse response2 = httpclient.execute(httpget2, context);
	try {
	    HttpEntity entity2 = response2.getEntity();
	} finally {
	    response2.close();
	}

## 1.4. 异常处理

HttpClient可抛出两种类型的异常：当一个I/O失败（如socket超时或者socket重置）时，抛出`java.io.IOException`；当一个HTTP失败（如违反HTTP协议）时，抛出`HttpException`。一般来说，I/O错误被认为非致命的，可修复的；而HTTP协议错误则被认为是致命的，不可自动修复的。

### 1.4.1. HTTP传输安全

理解HTTP协议并非对所有类型的应用程序都适合这一点非常重要。HTTP是一个简单的面向请求/响应的协议，它最初是为了支持静态或动态生成的内容检索而设计的。它并没有打算支持事务操作。举个例子，如果它成功接收并处理了请求，HTTP服务器将考虑履行它一部分合同，服务器会生成一个响应并向客户返回一个状态码。如果客户因为读取超时、请求取消或系统宕机而接收响应失败，服务器并不会试图回滚事务。如果客户决定重发相同请求，服务器将不可避免地多次执行相同的事务。某些情况下，这可能导致应用程序数据损坏或应用程序状态不一致。

尽管HTTP没有被设计成可以支持事务处理，但它仍可以被用作一个为关键任务提供一定满足条件的传输协议。为了保证HTTP传输层安全性，系统必须保证HTTP方法在应用层的幂等性。

### 1.4.2. 幂等性方法

HTTP/1.1规范定义了幂等性方法：

【N > 0 个相同的请求的作用和一个请求的作用相同，方法可以具有幂等性（除了错误和过期的问题）】

换句话说，应用程序应该保证为相同方法的多执行做好准备。这是可以实现的，例如，通过提供一个唯一的事务id和避免相同逻辑操作的其他途径。

要注意这个问题对于HttpClient并不特殊。基于浏览器的应用程序都有相同的问题，这和HTTP方法的非幂等性有关。

HttpClient认为非实体封装方法，例如`GET`和`HEAD`具有幂等性；而实体封装方法，例如`POST`和`GET`就不具有。

### 1.4.3. 自动异常修复

默认HttpClient会试图自动修复I/O异常。默认的自动修复机制仅仅限于一些安全的异常。

* HttpClient不会试图去修复任何逻辑或HTTP协议错误（那些继承了`HttpException`的类）。
* HttpClient会自动重试那些幂等性方法。
* HttpClient会自动重试那些，当HTTP请求仍然向目标服务器传送时，导致传输异常失败的方法（例如，请求并没有完整地传送到服务器）。

### 1.4.4. 请求重试处理程序

为了能够自定义异常恢复机制，可以提供`HttpRequestRetryHandler`接口的一个实现。
	
	HttpRequestRetryHandler myRetryHandler = new HttpRequestRetryHandler() {
	
	    public boolean retryRequest(
	            IOException exception,
	            int executionCount,
	            HttpContext context) {
	        if (executionCount >= 5) {
	            // Do not retry if over max retry count
	            return false;
	        }
	        if (exception instanceof InterruptedIOException) {
	            // Timeout
	            return false;
	        }
	        if (exception instanceof UnknownHostException) {
	            // Unknown host
	            return false;
	        }
	        if (exception instanceof ConnectTimeoutException) {
	            // Connection refused
	            return false;
	        }
	        if (exception instanceof SSLException) {
	            // SSL handshake exception
	            return false;
	        }
	        HttpClientContext clientContext = HttpClientContext.adapt(context);
	        HttpRequest request = clientContext.getRequest();
	        boolean idempotent = !(request instanceof HttpEntityEnclosingRequest);
	        if (idempotent) {
	            // Retry if the request is considered idempotent
	            return true;
	        }
	        return false;
	    }
	
	};
	CloseableHttpClient httpclient = HttpClients.custom()
	        .setRetryHandler(myRetryHandler)
	        .build();

## 1.5. 中止请求

 某些情况下，由于目标服务器的高载荷或者是客户端的大量的并发请求，HTTP请求处理不能够在预计的期限内完成。这种情况下，需要提前中止请求并唤醒因为I/O操作而阻塞的执行线程。通过`HttpUriRequest#abort()`方法，HttpClient执行的HTTP请求可以在任何执行阶段被中止。此方法是线程安全的，而且可以被任何线程调用。当一个HTTP请求被中止时，通过抛出一个`InterruptedIOException`，它的执行线程（即使它被I/O操作阻塞）保证会被唤醒。

## 1.6. HTTP协议拦截器

HTTP协议拦截器是一个实现了HTTP协议某个具体方面的程序。一般协议拦截器作用于一个特定或一组相关的传入消息头部。或者用有一个特定或一组相关的头部填充传出消息。协议拦截器也可以对封装了消息的内容实体进行操作——透明内容的压缩/解压就是一个很好的例子。通常这是使用“修饰模式”达成的，封装实体类被用来修饰原实体。几个协议拦截器可以组合而成为一个逻辑单元。

协议拦截器可以通过HTTP执行上下文共享信息来互相协作——例如一个处理状态。协议拦截器可以使用HTTP上下文来存储一个请求或几个连续请求的处理状态。

通常，只要拦截器不依赖于一个特定的处理上下文状态，它们的执行顺序没有关系。如果协议拦截器是相互依存的，那么必须在一个特定的顺序中执行，它们应该按他们期待的执行顺序添加到协议处理程序中。

这是一个本地上下文如何在连续请求之间保持一个处理状态的例子：

	CloseableHttpClient httpclient = HttpClients.custom()
	        .addInterceptorLast(new HttpRequestInterceptor() {
	
	            public void process(
	                    final HttpRequest request,
	                    final HttpContext context) throws HttpException, IOException {
	                AtomicInteger count = (AtomicInteger) context.getAttribute("count");
	                request.addHeader("Count", Integer.toString(count.getAndIncrement()));
	            }
	
	        })
	        .build();
	
	AtomicInteger count = new AtomicInteger(1);
	HttpClientContext localContext = HttpClientContext.create();
	localContext.setAttribute("count", count);
	
	HttpGet httpget = new HttpGet("http://localhost/");
	for (int i = 0; i < 10; i++) {
	    CloseableHttpResponse response = httpclient.execute(httpget, localContext);
	    try {
	        HttpEntity entity = response.getEntity();
	    } finally {
	        response.close();
	    }
	}

## 1.7. 重定向处理

除了那些HTTP协议明确禁止的（要求用户干预的）之外，HttpClient自动处理所有类型的重定向。`POST`和`PUT`请求出现的`See Other`（状态码303）重定向会根据HTTP规范转换为`GET`请求。我们可以使用一个自定义重定向策略来减少`POST`方法被HTTP规范强迫自动重定向的限制。

	LaxRedirectStrategy redirectStrategy = new LaxRedirectStrategy();
	CloseableHttpClient httpclient = HttpClients.custom()
	        .setRedirectStrategy(redirectStrategy)
	        .build();

HttpClient必须在它的执行过程中经常地重写请求信息。默认`HTTP/1.0`和`HTTP/1.1`一般使用相对请求`URIs`。同样地，原请求可能会被重定向到其他位置多次。最终解释的绝对HTTP位置可以使用原请求和上下文来创建。实用方法`URIUtils#resolve`可以创建那些用来生成最终请求的解析的绝对`URI`。此方法包含了重定向请求或原请求的最后片段的标记符。

	CloseableHttpClient httpclient = HttpClients.createDefault();
	HttpClientContext context = HttpClientContext.create();
	HttpGet httpget = new HttpGet("http://localhost:8080/");
	CloseableHttpResponse response = httpclient.execute(httpget, context);
	try {
	    HttpHost target = context.getTargetHost();
	    List<URI> redirectLocations = context.getRedirectLocations();
	    URI location = URIUtils.resolve(httpget.getURI(), target, redirectLocations);
	    System.out.println("Final HTTP location: " + location.toASCIIString());
	    // Expected to be an absolute URI
	} finally {
	    response.close();
	}