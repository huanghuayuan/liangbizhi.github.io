---
layout: post
title: 解决fullpage.js在未初始化完成前样式显示问题
categories: 前端
tags: javascript
comments: true
---

# 起因

之前做的一个项目需要用到fullpage插件实现全屏轮播，而且是首页，显示效果要求较高。由于fullpage.js是在它加载完成时再操作DOM的，所以在这段时间里，首页的第一个`section`显示会显示不正常（如背景颜色，和里面的元素定位等等）。

# 解决

由于第一个`section`的元素是绝对定位，所以可以把`section`设成`overflow: hidden`，以隐藏里面的元素。然后为`section`添加默认的背景色，这样就不那么突兀了。

