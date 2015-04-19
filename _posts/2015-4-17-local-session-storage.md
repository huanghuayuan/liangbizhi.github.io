---
layout: post
title: LocalStorage和SessionStorage使用注意点
categories: 前端
tags: html5
comments: true
---

# 简介

## 在客户端存储数据

HTML5 提供了两种在客户端存储数据的新方法：

* localStorage - 没有时间限制的数据存储
* sessionStorage - 针对一个 session 的数据存储

之前，这些都是由 cookie 完成的。但是 cookie 不适合大量数据的存储，因为它们由每个对服务器的请求来传递，这使得 cookie 速度很慢而且效率也不高。
在 HTML5 中，数据不是由每个服务器请求传递的，而是只有在请求时使用数据。它使在不影响网站性能的情况下存储大量数据成为可能。
对于不同的网站，数据存储于不同的区域，并且一个网站只能访问其自身的数据。
HTML5 使用 JavaScript 来存储和访问数据。

## 在chrome下观察

在Google Chrome浏览器下可以看到这两个对象的内容。F12 --> Resources选项卡 --> 左侧LocalStorage和Session Storage。开发过程中，我们可以非常方便等操作它们的内容。 

# 注意点

* 它们均只能存储 __字符串类型__ 的对象（虽然规范中可以存储其他原生类型的对象，但是目前为止没有浏览器对其进行实现），所以目前如果我们写类似如下代码时需要特别注意：

{% highlight javascript linenos %}
	localStorage.someValue = true;	// 向localStorage中写入javascript基本类型true值
	// ... some operation
	// 下面的if本意是想判断someValue的值是否为布尔类型true
	// 但localStorage取出来的是字符串"true"。所以此判断总是false
	if(localStorage.someValue == true) {
		// some code
	}
{% endhighlight %}

* localStorage生命周期是永久。但用户手动清除也是可以的。

* 不同浏览器无法共享localStorage或sessionStorage中的信息。

* 相同浏览器的不同页面间可以共享相同的localStorage（页面属于相同域名和端口），但是不同页面或标签页间无法共享sessionStorage的信息。这里需要注意的是，页面及标签页仅指顶级窗口，如果一个标签页包含多个iframe标签且他们属于同源页面，那么他们之间是可以共享sessionStorage的。

* 同源的判断规则：协议名、主机名和端口号是否都一样。

# API

## 保存读取

使用方法与SessionStorage如出一辙，如下代码所示：

此对象主要有两个方法：

* 保存数据：localStorage.setItem(Key, value);
* 读取数据：localStorage.getItem(Key);

Key：表示你要存入的键名称，此名称可以随便命名，可以按照变量的意思来理解。

Value：表示值，也就是你要存入Key中的值，可以按照变量赋值来理解。

当然还可以直接在后面跟`.someAttribute`来读取和保存数据。如：

{% highlight javascript linenos %}
	if (localStorage.pagecount) {
		localStorage.pagecount=Number(localStorage.pagecount) +1;
	} else {
		localStorage.pagecount=1;
	}
	document.write("Visits "+ localStorage.pagecount + " time(s).");
{% endhighlight %}

## 枚举localStorage

{% highlight javascript linenos %}
	for(var i = 0; i < localStorage.length; i++){
	     var name = localStorage.key(i);
	     var value = localStorage.getItem(name);
	}
{% endhighlight %}

# 清除

{% highlight javascript linenos %}
	localStorage.removeItem("key");		//删除名称为“key”的信息。
	localStorage.clear();			//清空localStorage中所有信息
{% endhighlight %}

# 参考

[w3cschool](http://www.w3school.com.cn/html5/html_5_webstorage.asp "w3school")