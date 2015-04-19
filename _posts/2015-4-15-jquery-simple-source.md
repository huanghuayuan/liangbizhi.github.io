---
layout: post
title: 简单实现jQuery中addClass和removeClass方法
categories: 前端
tags: jquery 源码
comments: true
---

为一个元素增加`classNasme`或移除`className`说到底还是字符串的操作。操作完后再赋值给原来元素的`className`属性。下面的代码比较简单，相信都能看懂。

{% highlight javascript linenos %}
	/**
	 * 判断obj对象是否含有clazz类名
	 */
	function hasClass(obj, clazz) {
		if(obj && obj.className) {
			return obj.className.match(new RegExp('(\\s|^)' + clazz + '(\\s|$)')) != null;
		}
		return false;
	} 

	/**
	 * 如果obj对象没有clazz类名，则为其添加
	 */
	function addClass (obj, clazz) {
		if (obj && !hasClass(obj, clazz)) {
			obj.className += (' ' + clazz);
		}
	}
	
	/**
	 * 如果obj对象有clazz类名，则为其移除
	 */
	function removeClass (obj, clazz) {
		if (obj && hasClass(obj, clazz)) {
			obj.className = obj.className.replace(new RegExp('(\\s|^)' + clazz + '(\\s|$)'), '');
		};
	}
{% endhighlight %}

这里需要说明的是正则表达式的书写。代码中构建的正则表达式对象直接量相当于`/(\\s|^)clazz(\\s|$)/`。

* `\s`表示任何Unicode空白字符。
* `|`用于分隔供选择的字符。
* 此例中`(...)`括号用在完整的模式中定义子模式。

有时间一定要看一看jQuery的源码呀(\*^__^\*) 。JavaScript真是太迷人啦。