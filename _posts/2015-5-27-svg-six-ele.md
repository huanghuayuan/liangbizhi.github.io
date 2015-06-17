---
layout: post
title: SVG六种基本图形元素以及DOM操作
categories: 前端
tags: svg
comments: true
---
# &lt;rect&gt;

如果只给定`rx`或`ry`其中一个，那么另一个也会赋予相同的值。

![rect](/media/images/svg-six-ele/rect.jpg)

# &lt;circle&gt;

这里的`cx`和`cy`是圆心的坐标（注意和`rect`区别）。

![circle](/media/images/svg-six-ele/circle.jpg)

# &lt;ellipse&gt;

![ellipse](/media/images/svg-six-ele/ellipse.jpg)

# &lt;line&gt;

![line](/media/images/svg-six-ele/line.jpg)

# &lt;polyline&gt;

折线。

![polyline](/media/images/svg-six-ele/polyline.jpg)

# &lt;polygon&gt;

多边形。也是描述了一个点集。他只不过将第一个点和第二个点连接起来形成一个闭合的多边形。

![polygon](/media/images/svg-six-ele/polygon.jpg)

# 属性：填充、描边和变换

属性是对图形样式的描述。

![attribute](/media/images/svg-six-ele/attribute.jpg)

# DOM操作

## 创建图形

	document.createElementNS(ns, tagName);

这里和创建HTML标签不同，这里还要加上`NS`，这是因为`SVG`它有它的命名空间。tagName就是上述的标签了。

## 添加图形

和HTML的方法一样。

	element.appendChild(childElement);

## 设置/获取属性

	element.setAttribute(name, val);
	element.getAttribute(name);