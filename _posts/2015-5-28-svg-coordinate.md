---
layout: post
title: SVG坐标系统和坐标变换
categories: 前端
tags: svg
comments: true
---

# 世界、视野和视窗的概念

视野是观察世界的一个矩形区域。而世界是无穷大的。

我们绘画的SVG世界是无穷大的。

视野是可以改变的，`svg`标签提供了`viewbox`属性来控制视野的范围。

* 视窗：`svg`标签`width`、`height`属性控制。
* 世界：`svg`标签之间的代码。
* 视野：`svg`标签`viewbox`和`preserveAspectRatio`属性控制。

视窗是浏览器开辟出来渲染SVG内容的区域。

SVG中有多少条线，多少个矩形，什么颜色等等都在定义着SVG的世界。

视野，也就是观察SVG这个世界的一个矩形区域。

如果视窗与视野大小一致，那么浏览器就可以完美地把视野填充到视窗里。否则，如何填充就成为了一个问题，`preserveAspectRatio`属性就派上了用场。

# 图形分组

使用`g`标签来创建分组。

在分组上设置的属性，子元素是可以继承下来的。

分组上的`transform`属性定义坐标变换。

分组可以嵌套使用。

# 坐标系统

笛卡尔直角坐标系。

SVG里的Y轴是垂直向下的，这个与数学中的直角坐标系不同。

所以SVG中的角度是顺时针开始的，而数学中的一般为逆时针。

# 四个坐标系

## 用户坐标系（User Coordinate）

SVG世界的坐标系。上面所说的`viewbox`就是使用该坐标系。用户坐标系是最原始的，其他坐标系都是由其产生。

## 自身坐标系（Current Coordinate）

每个图形或图形分组自身的坐标系。

## 前驱坐标系（Previous Coordinate）

父容器的坐标系。

![自身坐标系和前驱坐标系](/media/images/svg-coordinate/c-c-p-c.jpg)

## 参考坐标系（Reference Coordinate）

使用其他坐标系来考究自身的情况使用。