---
layout: post
title: JavaScript Source Map使用
categories: 前端
tags: javascript 工具
comments: true
---

无意中看到阮一峰一篇博客[《JavaScript Source Map 详解》](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html "JavaScript Source Map 详解")。但他在文中并没有详细地说明如何使用，导致加载不了map文件。

首先到`jQuery`官网下载非压缩版的源码文件[jquery-1.11.3.js](http://code.jquery.com/jquery-1.11.3.js "jquery-1.11.3.js")。

下载`Google Closure Compiler`工具。

命令窗口使用`Google Closure Compiler`压缩`jquery-1.11.3.js`源文件，并同时生成`map`文件：

	java -jar compiler.jar \
		--js jquery-1.11.3.js \
		--create_source_map ./jquery-1.11.3.js.map \
		--source_map_format=V3 \
		--js_output_file jquery-1.11.3.min.js

把`jQuery`源文件、压缩版js文件和`map`文件放到同一个目录即可。