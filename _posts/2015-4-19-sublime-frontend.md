---
layout: post
title: Web前端sublime使用技巧
categories: 前端
tags: 工具
comments: true
---

平常使用IDE比如WebStorm等来开发Web前端项目。这种IDE通常集成了很多功能，导致其启动速度非常慢。经常要等它十几秒，对于我们这些像风一般的程序员，显然这是不能忍的。俗话说：“工欲善其事必先利其器”，要是有个轻量一些，启动快一些，而且功能强大的编辑器就好了。当然它就是sublime编辑器啦！下面就针对Web前端开发来说说它的一些使用技巧。

# Go to anything和命令模式

先简单简绍一下Sublime两个经常用的功能。

第一个是Go to anything。`ctrl + p`打开该功能，在弹出的输入栏中可以输入文件名等内容，Sublime就可以帮助我们快速定位到该文件了，通过上下键来选择文件，同时，内容框中也会即时预览文件内容，非常方便。

第二个是命令模式。`ctrl + shift + p`打开。命令支持模糊查找，比如可以输入`sidebar`来选择开关侧边栏命令，可以输入`minimap`来选择开关右侧的迷你地图命令等等。通过命令模式，Sublime能把我们从繁琐的鼠标操作中解放出来。

# 安装Package Control

Package Control是Sublime Text的包管理器，它使我们能极其简单地完成查找、安装和保持包更新等任务。一般安装了sublime之后是没有这个东东的（本人用的是Sublime Text 2）。安装它也很简单，到其官网复制一段代码到Sublime Text编辑器执行就可以了。

1. 复制对应自己版本的Sublime Text[官网安装代码](https://packagecontrol.io/installation "官网安装代码")。
2. 打开Sublime Text，按 ctrl + ` 打开控制台，复制上面的代码执行，等待安装完成，重启Sublime即可。

# 安装emmet插件

emmet插件相信大家都知道，它最核心的功能就是可以通过书写缩写命令来生成HTML代码。它的语法有点像CSS的选择器再加上一些扩展的语法。

在Sublime中`ctrl + shift + p`打开命令菜单，输入"install package"，Sublime会模糊匹配到相应的命令。打开之后，Sublime会自动加载最新的包信息（留意状态栏）。之后搜索"emment"安装该插件。打一次应用emment插件时，Sublime会加载PyV8，这个过程可能有点慢，如果慢到不能忍，可以手动安装PyV8。

emment使用非常简单，比如输入：

	#page>div.logo+ul#navigation>li*5>a{Item $}

接着按tab键，emment插件就会生成如下HTML代码：

{% highlight html linenos %}
	<div id="page">
	    <div class="logo"></div>
	    <ul id="navigation">
	        <li><a href="">Item 1</a></li>
	        <li><a href="">Item 2</a></li>
	        <li><a href="">Item 3</a></li>
	        <li><a href="">Item 4</a></li>
	        <li><a href="">Item 5</a></li>
	    </ul>
	</div>
{% endhighlight %}

从此我萌就再也不用手动写HTML代码了。更多语法请参考emmet的官方文档，这里就不详述了。

# 安装一些snippets

平时我们会经常写一些javascript比如`document.getElementById`、`document.getElementsByTagName`等等诸如此类的比较繁琐的代码。有没有更简单的方式呢？通过安装一些snippets插件就可以啦。

本人安装了javascript & nodejs snippets和jquery的snippets，它们都可以通过install package命令来安装，搜索支持模糊匹配。

安装后，就可以简化上面代码的书写了，比如你输入：

	gi

Sublime就会提示，选中提示并回车后，如下代码即可生成：

	document.getElementById('id');

此时我们可以配合tab键选中`'id'`来修改成我们想要的id值。

当然，它还有更多的代码提示，这需要大家去发现了。

# 安装侧边栏增强工具

Sublime默认是打开侧边栏的，如果没有请先打开。在侧边栏选中文件按右键，初始情况下Sublime只会弹出关闭的菜单，对于Web前端开发人员来说，这个功能显然是撇脚的。要是有个什么"在浏览器中打开"就完美了！你想想，当我们选中index.html时不正需要这个功能么？

Sidebar Enhancements就是提供这种功能的插件，我们可以在package control官网中搜到它的详细信息。遗憾的是，它好像只支持Sublime Text 3。具体内容留给大家体验吧。

# javascript注释

写过java的都知道java doc，如果我们也想在javascript中写类似的注释呢？我们可以选择DocBlockr插件。同样它也可以在install package命令下安装。怎么写java doc注释可以参考网上资料:-D

这里介绍的只是一些实用的工具，更多Sublime的功能有待大家去开发(*^__^*)。
