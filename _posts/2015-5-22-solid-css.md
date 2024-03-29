---
layout: post
title: 高质量的CSS
categories: 前端
tags: css
comments: true
---
# 怪异模式和DTD

如果漏写DTD声明，Firfox仍然会按照标准模式来解析网页，但在IE（包括6、7、8）就会触发怪异模式。

例如对于盒子模型两者表现差别较大：

标准：元素宽度 = padding + border + width

怪异：width = padding + border

为了避免触发怪异模式，请声明DTD。常见HTML DTD包括严格型、过渡型等类型。 

# 组织CSS

把网站所有样式按照职能分成三大类：base、common和page。

## base层

提供CSS reset功能和粒度最小的通用类。这一层被所有页面引用，为最底层。改层相对稳定，基本不需要维护。

## common层

提供组件级的CSS类。我们可以把页面大量重复的“模块”视为一个组件。尽可能多地将组件提取出来，放在common层里。该层就相当于MVC模式的M。不同的网站有不同的common层，common层是网站级的。在团队合作中，common层最好有一个人负责。

## page层

非高度重用的模块，可以放在page层。该层位于最高层，提供页面级样式。

可能会产生大量CSS文件，如果规模不大，可以将所有page层代码放在一个page.css文件里，根据页面配上注释，分块书写。这么做可能会带来些冗余，对于文件过于分散和集中的问题并没有完美的解决办法。

有时把它们集中在一个文件中更便于维护，且便于浏览器缓存，浏览网站时只有首页的下载时间较长，浏览其他页面时反而较快。

# 挂多个class还是新建class

在面向对象编程中，有个重要的原则就是“多用组合，少用继承”。在使用CSS时，灵活这点可以减少类的数量。一方面，减少了代码量，提高了可维护性；另一方面，使类的职责更单一，弹性更强，增加了类的重用性，提高了开发效率。

# 低权重原则

为了保证样式容易被覆盖，提高可维护性，CSS选择符需保证权重尽可能低。

# CSS Sprite

将网站的多张背景图合拼到一张大图片上。可以大大减少网页的HTTP请求数，减少服务器压力。但它也减低了可维护性，对于流量不大的网站，CSS Sprite好处并不明显。

# CSS hack

## IE条件注释法

如果是IE浏览器，将引入一个CSS文件。

	<!--[if IE]>
	<link ... />
	<![endif]-->

分别是如果是IE6、高于IE6、只在IE7上不生效。

	<!--[if IE 6]>
	<link ... />
	<![endif]-->

	<!--[if gt IE 6]>
	<link ... />
	<![endif]-->

	<!--[if ! IE 7]>
	<link ... />
	<![endif]-->

## 选择符前缀法

`*html`只对IE 6生效。

`*+html`只对IE 7生效。

例如

	.test{}				/* IE 6, IE 7, IE 8 */
	*html .test{}		/* only for IE6 */
	*+html .test{}		/* only for IE 7 */

该方法不能用在内联样式上。

## 样式属性前缀法

`_`只在IE 6下生效。

`*`在IE 6和IE 7下生效。

	.test{width: 80px; *width: 70px; _width: 60px;}

# 居中

## 水平居中

### 文本、图片等行内元素的水平居中

父元素设置`text-align: center`。

### 宽度确定 块级 元素水平居中

`margin-left: auto; margin-right: auto;`

### 宽度不确定 块级 元素水平居中

* 方法一：设置块级元素`display: inline`，然后父元素使用`text-align: center`来实现居中。
* 方法二：设置父元素`float: left; position: relative; left: 50%`，子元素`position: relative; left: -50%`实现水平居中。当然此方法并不能适用于所有情况，原理大概如此。

## 垂直居中

### 父元素高度不确定的文本、图片、块级元素的竖直居中

父元素高度不确定，为内容撑开。通过给父容器设置相同上下边距实现。

### 父元素高度确定的单行文本的竖直居中

给父元素设置line-height值，该值和父元素高度相同即可，大家都知道。

### 父元素高度确定的多行文本、图片、块级元素的竖直居中

有一个用于竖直居中的属性`vertical-align`，但只有当父元素为`td`或`th`时才生效。对于块级元素默认是不支持的，为其设置`display: table-cell`即可（IE6、7不支持）。

对于IE6、7可以直接使用表格，但带来了无意义标签。或者使用hack。

# 参考

[1] 曹刘阳 著；编写高质量代码：Web前端开发修炼之道 （Writing Solid Web Front-End Code）；机械工业出版社，2010