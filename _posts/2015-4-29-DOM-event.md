---
layout: post
title: DOM Event事件
categories: 前端
tags: javascript
comments: true
---

# 事件流

描述的是从页面中接受事件的顺序。

IE实现的是事件冒泡流，Netscape实现的是事件捕获流。

## 事件冒泡

即事件最开始由具体的元素（文档中嵌套层次最深的那个节点）接收，然后逐级向上传播至最不具体的那个节点（文档节点）。

## 事件捕获

不太具体的节点应该更早接收到事件，而最具体的节点最后接收到事件。

可以放心使用事件冒泡流。

# 使用事件处理程序

## HTML事件处理程序

以HTML属性绑定事件的方法，但不利于代码解耦。

## DOM 0级事件处理程序

较传统的方法，即把一个函数赋值给一个事件的处理程序属性。

特点：简单、跨浏览器。没有HTML事件处理程序的缺点。

## DOM 2级事件处理程序

怎么没有1级？没有的啦。

DOM 2级事件定义了两个方法：`addEventListener()`和`removeEventListener()`。

它们都接收三个参数：①要处理的事件名（不加`on`）②事件处理程序③bool值。

第三个参数：`true`表示在事件捕获阶段处理事件；`false`表示在事件冒泡阶段捕获事件。一般为`false`。

`addEventListener()`添加的事件只能通过`removeEventListener()`方法移除。

## IE事件处理程序

IE特别呀。它也提供了DOM 2级类似的两个方法：`attachEvent()`和`detachEvent()`。

它们都接收两个参数：①要处理的事件名（要加`on`）②事件处理程序。

为什么没有像DOM 2级事件一样有第三个bool值呢？IE8-的浏览器只支持事件冒泡流啦。

支持IE事件处理程序的浏览器：IE和Opera。

## 跨浏览器的事件处理程序

使用能力判断。

{% highlight javascript linenos %}
	var eventUtil = {
		addHandler : function (element, eventName, handler) {
			// 如果有DOM 2级能力。
			if(element.addEventListener) {
				element.addEventListener(eventName, handler, false);
			}// 否则如果有IE事件处理能力
			else if(element.attachEvent) {
				element.addEvent('on' + eventName, handler);
			}// DOM 0 级	
			else {
				element['on' + eventName] = handler;	// element['onclick'] === element.onclick
			}
		}
		removeHandler : function () {
			if(element.removeEventListener) {
				element.removeEventListener(eventName, handler, false);
			}
			else if(element.detachEvent) {
				element.detachEvent('on' + eventName, handler);
			}
			else {
				element['on' + eventName] = null;
			}
		}
	};
{% endhighlight %}

# 事件对象

Event对象包含了发生事件的各种属性。下面简单介绍一下。

## DOM中的事件对象

1. type属性，获取事件类型。
2. target属性，获取事件目标。
3. bubbles属性，声明该类型事件是否在文档树中冒泡。
4. cancelable属性，该事件是否具有能用preventDefault()方法取消的默认动作。

5. stopPropagation()方法，阻止事件冒泡。
6. preventDefault()方法，阻止事件的默认行为。比如阻止a链接的默认跳转行为。

## IE中的事件对象

IE8-事件对象从window.event全局属性中取得。

1. type属性。
2. srcElement属性，获取事件目标。

3. cancelBubble属性，阻止事件冒泡。(true or false)
4. returnValue属性，阻止事件的默认行为。