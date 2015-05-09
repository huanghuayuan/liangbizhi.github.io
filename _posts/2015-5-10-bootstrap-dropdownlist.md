---
layout: post
title: Bootstrap下拉菜单
categories: 前端
tags: bootstrap css
comments: true
---

**特别声明:**因为Bootstrap的组件交互效果都是依赖于jQuery库写的插件，所以在使用bootstrap.min.js之前一定要先加载jquery.min.js才会生效果。

	<div class="dropdown">
        <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
		选择你喜欢的水果
			<span class="caret"></span>
		</button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li><a class="listitem">苹果</a></li>
            <li><a class="listitem">香蕉</a></li>
            <li><a class="listitem">梨</a></li>
            <li><a class="listitem">桃</a></li>
        </ul>
    </div>

1. 使用一个名为“dropdown”的容器包裹了整个下拉菜单元素，示例中为:

	`<div class="dropdown"></div>`

2. 使用了一个`<button>`按钮做为父菜单，并且定义类名`dropdown-toggle`和自定义`data-toggle`属性，且值必须和最外容器类名一致，此示例为:

	data-toggle="dropdown"

3. 下拉菜单项使用一个`ul`列表，并且定义一个类名为`dropdown-menu`，此示例为:

	`<ul class="dropdown-menu">`

# 下拉分隔线

在Bootstrap框架中的下拉菜单还提供了下拉分隔线，假设下拉菜单有两个组，那么组与组之间可以通过添加一个空的`<li>`，并且给这个`<li>`添加类名`divider`来实现添加下拉分隔线的功能。

# 其他一些特点

比如菜单标题、下拉菜单对齐方式、菜单项状态等功能。

# 参考

[http://www.imooc.com/learn/141](http://www.imooc.com/learn/141)