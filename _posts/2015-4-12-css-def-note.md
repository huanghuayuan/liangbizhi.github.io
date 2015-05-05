---
layout: post
title: 《CSS权威指南》复习笔记
categories: 前端
tags: 学习
comments: true
---

# CSS和文档

* `link`标记。

{% highlight html linenos %}
	<link rel="stylesheet" type="text/css" href="sheet1.css" media="all" />
{% endhighlight %}

	rel代表“关系”（relation），这里为stylesheet。还可以为alternate stylesheet以定义候选样式表，如果是这样还需要link标记的另外一个属性title以表示候选样式表的标题；media说明这个样式表要应用于哪一种表现媒体。

* `@import`指令。它出现在只能出现在样式里，而且要放在CSS规则之前。`@import`指令无法指定候选样式表，但同样可以控制样式表应用于哪一种媒体。注意它是分号结尾的。

{% highlight css linenos %}
	@import url(http://example.org/layout.css) all;
	@import url(sheet2.css) screen;
{% endhighlight %}

* 如果较老的浏览器不能识别<style>标签，就会将其统统忽略掉。不过这些标记中的声明不一定会被忽略，会出现在页面的上面！为了解决这个问题，可以如下操作，能理解CSS的浏览器仍能读取样式。

{% highlight html linenos %}
	<style type="text/css"><!--
		@import url(sheet2.css);
		h1 {color: maroon;}
	--></style>
{% endhighlight %}

# 选择器

* 元素选择器

* 分组选择器

{% highlight css linenos %}
	h1, h2, h3, p {color: gray;}
{% endhighlight %}

* 通配选择器

{% highlight css linenos %}
	* {color: red;}
{% endhighlight %}

* 类选择器

{% highlight css linenos %}
	*.warning {color: red;}			// 通配符
	.warning {color: red;}			// 当然可以省略通配符
	p.warning {font-weight: bold}	// 只应用于p元素
{% endhighlight %}
	
	有一种情况叫多类选择器。如`<p class="urgent warning">`时，通过把两个（多个）类选择器链接在一起，仅可以选择同时包含这些类名的元素（类名的顺序可以不限）。

{% highlight css linenos %}
	.warning {font-weight: bold;}
	.urgent {font-style: italic;}
	p.warning.urgent {background: silver}	// IE7之前的版本不能正确地处理多类选择器，它们可能会识别为p.urgent
{% endhighlight %}

* ID选择器。ID属性不允许有以空格分隔的词列表。

> **注意**：类选择器和ID选择器可能是区分大小的，这取决于文档语言。HTML和XHTML是区分的。有一些老浏览器不区分，现在所有浏览器都区分。

* 属性选择器。可以根据标签元素的属性及属性值来选择元素。共有4种。

> IE5/Mac和IE6/Win之前，IE不支持属性选择器。

{% highlight css linenos %}
	// 1. 简单属性选择器
	h1[class] {color: silver;}			// 选择有class属性的所有h1元素
	*[title] {font-weight: bold;}		// 选择所有包含title属性的标签元素
	a[href][title] {font-weight: bold;} // 选择同时具有href和title属性的a元素

	// 2. 根据具体属性值选择
	p[class="urgent warning"] {color: red;}		// 选择clss属性为urgent waring的p元素，注意class属性值必须完全字符串匹配。
	a[href="a.html"][title="a page"] {font-size: 200%;}		// 多个属性

	// 3. 根据部分属性值选择
	p[class~="warning"] {color: red;}		// 根据属性值中出现的一个用空格分隔的词来完成选择
	[foo^="bar"]		// 选择foo属性值以“bar”开头的所有元素
	[foo$="bar"]		// 选择foo属性值以“bar”结尾的所有元素
	[foo*="bar"]		// 选择foo属性值包含“bar”子串的所有元素

	// 3. 特定属性选择类型
	*[lang|="en"] {color: red;}
	img[src*="space"] {border: 5px solid red;}
{% endhighlight %}

* 后代选择器（学习这个选择器的时候请把文档结构想象成为一棵树）

{% highlight css linenos %}
	//	<div>
	//		<ul>
	//			<li id="1">Some text</li>
	//			<li id="2">Some text</li>
	//			<li id="3">Some text</li>
	//		</ul>
	//		<ol>
	//			<li id="4">Some text</li>
	//			<li id="5">Some text</li>
	//			<li id="6">Some text</li>
	//		</ol>
	//	</div>

	// 1. 后代元素选择器
	div li {color: gray;}				// 选择div元素后代的所有li元素，id为1,2,3,4,5,6的li元素都会被选择
	ul ol ul em {color: gray;}
	blockquote b, p b {color: gray;}	// 作为块引用或段落的b元素中的文本

	// 2. 子元素选择器（注意不是后代元素）
	h1 > strong {color: red;}			// 选择作为h1元素子元素的所有strong元素
	ul > li {color: red;}				// id为1,2,3的li元素会被选择

	// 3. 相邻兄弟元素选择器
	// 注意：是元素后面出现的兄弟元素
	// 注意：一个结点符只能选择两个相邻弟兄的第二个元素
	li + li {color: red;}				// id为2,3和5,6的元素会被选择
	ol + ul {color: red;}				// 失败，因为ol后没有ul兄弟元素
	ul + ol {colro: red;}				// 选择的是ol元素

{% endhighlight %}

>IE6之前不支持子元素选择器和相邻兄弟选择器。

* 伪类选择器和伪元素选择器

1. 伪类选择器

	这些选择器可以为文档中不一定具体存在的结构指定样式，或者为某些元素的状态所指示的幻像类指定样式。换句话说，会根据另外某种条件而非文档结构向文档中的某些部分应用样式，而且无法通过研究文档的标记准确地推断出采用何种方式应用样式。

	1. 链接伪类（静态，第一次显示之后，它们一般不会再改变文档的样式）

	|伪类名    |描述                                         |
	|:--------|:--------------------------------------------|
	|:link    |超链接（有href属性）并指向一个未访问地址的所有锚  |
	|:visited |指示作为已访问地址超链接的所有锚                 |

	2. 3个动态伪类（可以应用到任何元素）	

	|伪类名    |描述                                         |
	|:--------|:--------------------------------------------|
	|:focus   |指示当前拥有输入焦点的元素                      |
	|:hover   |指示鼠标指针停留在哪个元素上                     |
	|:active  |指示被用户输入激活的元素                        |

	使用动态伪类时会改变页面布局。
	
	3. 选择第一个子元素
	
	`:first-child`选择元素的第一个子元素。例如想选择作为某元素第一个子元素的p元素，应当写成p:first-child。

	4. 语言选择

	*:lang(fr) {font-style: italic;}  // 把所有的法语显示成斜体

2. 伪元素选择器
	
	伪元素能够在文档中插入假想的元素，从而得到某种效果。

	{% highlight css linenos %}
		h2:first-letter {color: red;}		// h2中第一个字母大写

		p:first-line {color: purple;}		// 每一段显示地第一行
	{% endhighlight %}

	> 注意这两个伪元素所允许的属性是有限制的，详见书本。

	设置之前和之后元素的样式

	{% highlight css linenos %}
		h2:before {content: "<<"; color: silver;}	// 在h2前加一对小于号
		body:after {content: " The End ";}
	{% endhighlight %}

# 结构和层叠

* 选择器特殊性计算。如果一个元素有两个或多个冲突的属性声明，那么有最高特殊性的声明就会胜出。

	1. 内联样式，特殊性1,0,0,0。（CSS2.1）
	2. 对于选择器中给定的各个**ID**属性值，加0,1,0,0。
	3. 对于选择器中给定的各个**类**属性值、**属性选择器**或**伪类**，加0,0,1,0。
	4. 对于选择器中给定的各个**元素**和**伪元素**，加0,0,0,1。
	5. 结合符和通配符选择器对特殊性没有任何贡献。注意：通配符选择器是有特殊性的，为0,0,0,0，而结合符选择器则根本没有特殊性。

看一条选择器时，先看有多少个元素选择，再看有多少个类、属性、伪类选择，最后看有多少个ID选择。加起来。

* 选择器重要性。有时某个声明可能非常重要，超过了所有其他声明，并允许在这些声明结束分号之前插入!important来标志。它的声明并没有特殊的特殊值，不过应与非重要声明分开考虑。**如果一个重要声明和一个非重要声明冲突，重要声明总是胜出**。

* 继承值是没有特殊性的，所以特殊性为0的通配符选择器将胜出，如：
	
	* {color: gray;}
	h1#page-title {color: black;}

	<h1 id="page-title">Hello<em>World</em></h1>

那么<em>元素中的文字将是灰色的。

* 某些属性是不能继承的。例如，border属性，还有大多数的框模型属性（外边距、内边距、背景和边框）。

* 层叠。当特殊性相等的两个规则应用到同一个元素时。冲突的声明要通过这个层叠过程排序，并由此确定最终的文档表示。

* Web安全色。在256色计算机系统上不会抖动的颜色。Web安全颜色可以表示为RBG值20%和51（十六进制33）的倍数。

* 绝对长度单位 1 in = 2.54 cm = 72 pt(点) = 12 pc(pica派卡)

* 相对长度单位。三种em、ex和px。

	em定义为一种给定字体的font-size值。如果一个元素的font-size为14像素，那么对于该元素，1em = 14像素。
	ex指所用字体中小写x的高度。
	px其实也是先对长度。

# 字体

# 文本属性

* vertical-align属性只应用于行内元素、替换元素和表单元格。

* white-spacing属性。我们知道默认的XHTML处理已经完成了空白符处理：它会把所有空白符合并为一个空格。当white-space设置为pre时，空白符不会被忽略。

* text-align只应用于块级元素的内联内容。

# 基本视觉格式化

* 内容的背景（例如某种颜色或平铺图像）也会应用到内边距。内边距不能是负值，外边距可以。

* 非替换元素：如果元素的内容包含在文档中，则称之为非替换元素。

* 替换元素：作为其他内容占位符的一个元素。例如<img>。

* 水平格式化的“7大属性”：左外边距、左边框、左内边距、宽度、右内边距、右边框和右外边框。7个水平属性的总和要等于父元素的width。只有3个属性可以设置为auto：元素内容的width，以及左右外边距。其余属性必须设置为特定的值。

* 非替换元素的所有规则同样适用于替换元素，只有一个例外：如果width为auto，元素的宽度则是内容的固有宽度。可以为width制定一个特定值覆盖这个规则。

* 垂直格式化的“7大属性”：上外边距、上边框、上内边距、高度、下内边距、下边框和下外边框。7个垂直属性的总和要等于父元素的height。只有3个属性可以设置为auto：元素内容的height，以及上下外边距。其余属性必须设置为特定的值。如果正常流中一个块元素的margin-top和margin-bottom设置为auto，它会自动计算为0。如果要垂直居中，可以尝试用百分比。

* 垂直相邻外边距的合并，两个外边距中较小的一个会被较大的一个合并。这种合并行为只应用于外边距，如果元素有内边距和边框，它们绝对不会合并。

# 内边距、边框和外边距

* width和height属性应用于块级元素和和替换元素。

* margin属性应用于所有元素。百分数单位是相对于其父元素的width属性。

* 框内容层次关系：边框、内边框和内容、背景图、背景色、外边距。

# 浮动

* 浮动后块状元素的宽度会根据内容进行调节。

* 当父包含块缩成一条时，用`clear: both`方法清除浮动是没有效果的，它一般用于紧邻后面的元素的清除浮动。一般用`width: 100%; overflow: hidden;`清除浮动，IE6还要启动hasLayout，添加`*zoom:1;`。

* 相对定位（relative）。特点：
	1. 相对于自身原有位置进行偏移。
	2. 仍处于标准文档流中。
	3. 随即拥有偏移属性和z-index属性。

* 绝对定位。特点：
	1. 建立了以包含块为基准的定位。
	2. 完全脱离了标准文档流。
	3. 随即拥有偏移属性和z-index属性。
	4. **当未设置偏移量时**，无论是否存在已定位祖先元素，都保持在元素初始位置。
	5. **当设置了偏移量时**：如果无已定位祖先元素，以<html>为偏移参照基准；如果有已定位祖先元素，以距其**最近的**已定位祖先元素为偏移参照基准。（已定位是指position为relative、absolute和fixed）。
	6. 当一个元素设置绝对定位，没有设置宽度时，元素的宽度根据内容进行调整。
	
* 使用absolute实现横向两列布局。常用于一列固定宽度，另一列宽度自适应的情况。主要应用：设置自适应宽度元素的父元素relative相对定位；设置自适应宽度元素绝对定位absolute。