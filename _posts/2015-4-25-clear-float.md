---
layout: post
title: 各种清除浮动
categories: 前端
tags: css
comments: true
---

继续是百度前端技术学院ife的课程。各种清除浮动的方法对比。在了解了什么是BFC和hasLayout后，下文就能容易理解了。

# 1 添加额外标签

通过在浮动元素末尾添加一个空的标签例如 <div style="clear:both"></div>，其他标签br等亦可。

优点：通俗易懂，容易掌握。

缺点：可以想象通过此方法，会添加多少无意义的空标签，有违结构与表现的分离，在后期维护中将是噩梦，这是坚决不能忍受的，不要用了。

# 2 使用 br标签和其自身的 html属性

这个方法有些小众，br 有 clear="all | left | right | none"属性。

优点：比空标签方式语义稍强，代码量较少。

缺点：同样有违结构与表现的分离，不使用。

# 3 父元素设置 overflow：hidden

通过设置父元素overflow值设置为hidden；在IE6、7中还需要触发hasLayout，例如 zoom：1。

优点：不存在结构和语义化问题，代码量极少。

缺点：内容增多时候容易造成不会自动换行导致内容被隐藏掉，无法显示需要溢出的元素；04年POPO就发现overflow:hidden会导致中键失效，这是我作为一个多标签浏览控所不能接受的。所以还是不要使用了。（这个问题还没有遇到过，先记着）。

# 4 父元素设置 overflow：auto 属性

同样IE6、7需要触发hasLayout，和3差不多。

优点：不存在结构和语义化问题，代码量极少。

缺点：多个嵌套后，firefox某些情况会造成内容全选；IE中 mouseover 造成宽度改变时会出现最外层模块有滚动条等，firefox早期版本会无故产生focus等, 不要使用。

# 5 父元素也设置浮动

不推荐使用

# 6 父元素设置display:table

优点：结构语义化完全正确，代码量极少。

缺点：盒模型属性已经改变，由此造成的一系列问题，得不偿失，不推荐使用。

# 7 使用:after 伪元素

从各个方面比较，after伪元素闭合浮动无疑是相对比较好的解决方案了，下面详细说说该方法。

	.clearfix:after {content:"."; display:block; height:0; visibility:hidden; clear:both; }
	.clearfix { *zoom:1; }

* display:block使生成的元素以块级元素显示,占满剩余空间。
* height:0 避免生成内容破坏原有布局的高度。
* visibility:hidden 使生成的内容不可见，并允许可能被生成内容盖住的内容可以进行点击和交互。
* 通过 content:"."生成内容作为最后一个元素，至于content里面是点还是其他都是可以的，例如oocss里面就有经典的content:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",有些版本可能content 里面内容为空,一丝冰凉是不推荐这样做的,firefox直到7.0 content:"" 仍然会产生额外的空隙。
* zoom：1 触发IE hasLayout。

通过分析发现，除了clear：both用来闭合浮动的，其他代码无非都是为了隐藏掉content生成的内容，这也就是其他版本的闭合浮动为什么会有font-size：0，line-height：0。

# 参考

[http://www.iyunlu.com/view/css-xhtml/55.html](http://www.iyunlu.com/view/css-xhtml/55.html)