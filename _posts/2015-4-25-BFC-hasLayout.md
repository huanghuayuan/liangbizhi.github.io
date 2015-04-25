---
layout: post
title: BFC与hasLayout
categories: 前端
tags: CSS 浏览器
comments: true
---

最近在GitHub上关注百度前端技术学院ife的课程。参考了不少博客，学到了很多，下面来总结一下BFC和hasLayout的理解。

# 什么是BFC

BFC(Block Formatting Context)，可以译为“块级格式化上下文”。一开始感觉挺难懂的。我所理解的上下文是元素所在的作用范围或环境，以及在这个范围或环境中产生的关系。

它是CSS 2.1规范中的概念。可以到`www.w3.org`查看该规范。它决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。一个环境中的元素不会影响到其它环境中的布局。比如浮动元素会**形成BFC**，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。这里有点类似一个BFC就是一个独立的行政单位的意思。也可以说BFC就是一个作用范围。

## 几个BFC表现

1. 创建了BFC的元素中，它的子元素们按文档流一个接一个地放置。相邻两个元素之间的垂直距离取决于`margin`属性。举个例子好了，一般垂直方向上的`margin`是会合并的。但如果为它们创建了不同的BFC后，它们的`margin`就**不会合并**了。

2. BFC是页面上一个隔离的独立容器，里面的子元素不会在布局上影响到外面的元素；外面的元素也不会影响到里面的元素。

3. 创建了BFC的元素不能与浮动元素重叠。这个可以用来实现**自适应宽度布局**。

4. 根据CSS 2.1规范的高度计算规则，在计算BFC元素高度时，其浮动子元素应该参与计算。利用这个可以实现**闭合浮动**（避免高度坍塌）。

还有其他一些规则（4个），详见参考博客。

# 什么是IE的hasLayout

`hasLayout`是IE浏览器渲染引擎的一个内部组成部分。在IE浏览器中，一个元素要么自己对自身的内容进行组织和计算大小，要么依赖于包含块来计算尺寸和组织内容。为了协调这两种方式的矛盾，渲染引擎采用了`hasLayout`属性，属性值可以为`true`或`false`。当一个元素的`hasLayout`属性值为`true`时，我们说这个元素有一个布局（layout），或拥有布局。

`hasLayout`与BFC有很多相似之处。一个元素触发`hasLayout`会影响一个元素的尺寸和定位，这样会消耗更多的系统资源，因此 IE设计者默认只为一部分的元素触发`hasLayout`（即默认有部分元素会触发`hasLayout`，这与BFC基本完全由开发者通过特定CSS触发并不一样）。

特别注意的是，`hasLayout`在IE 8+已经被抛弃，所以在实际开发中只需针对IE 8以下的浏览器为某些元素触发`hasLayout`。

# 一个简单的例子

{% highlight html linenos %}
	* {margin: 0; padding: 0}
	.black, .blue, .yellow, .green {
		float: left;
		height: 100px;
		width: 100px;
	}
	.black {background-color: black;}
	.blue {background-color: blue;}
	.yellow {background-color: yellow;}
	.green {background-color: green;}
	p{margin-left: 50px; background-color: red;}
	
	...

	<div class="c1">
		<div class="black"></div>
		<div class="blue"></div>
	</div>
	<div class="c2">
		<div class="yellow"></div>
		<div class="green"></div>
	</div>
	<p>我是一个margin-left: 50px的段</p>
{% endhighlight %}

显示效果如下：

![](/media/images/BFC-hasLayout/1.jpg)

本意上是想形成两行两列的布局，但是由于.black，.blue，.yellow，.green四个div在同一个布局环境BFC中，因此虽然它们位于两个不同的div（.c1和.c2）中，但仍然不会换行，而是一行四列的排列。

怎么解决？就要为.c1和.c2创建两个不同的BFC了。

# 如何创建BFC

当一个HTML元素满足下面条件的**任何一点**，都可以产生BFC：

* `float`值非none。
* `overflow`值非visible。
* `display`值为table-cell, table-caption, inline-block任一个。
* `position`值非relative和static。

所以为上面例子加代码即可创建两个不同的BFC，它们各自的布局不会影响到外部元素：

{% highlight html linenos %}
	.c1{ overflow: hidden; }
	.c2{ overflow: hidden; }
{% endhighlight %}

![](/media/images/BFC-hasLayout/2.jpg)

# 如何触发hasLayout

除了IE默认会触发`hasLayout`的元素外（详见参考），还可以使用特定的CSS触发元素的hasLayout。

综合考虑浏览器之间的兼容和对元素的影响，建议使用zoom: 1来触发元素的hasLayout。

# BFC的几大用处

## 防止margin折叠

	div{
	    overflow: hidden;
	    background-color: blue;
	}
	p{
	    margin: 20px;
	}

	<p>this is paragraph</p>
	<p>this is paragraph</p>
	<div>
	  <p>this is paragraph whose parent create a new block context</p>
	</div>

因为创建了BFC,所以被div包含的p与它前面那个兄弟元素p之间有40个px单位，而不是20个。

## 闭合浮动

	div{
	    background: blue
	}
	.float{
	    float:left;
	    
	}
	.new{
	    overflow: hidden;
	}
	
	<div class=new>
	    <p class=float>this is a float p tag in a blue background div tag</p>
	</div>
	<div>
	    <p class=float>this is a float p tag in a blue background div tag</p>
	</div>

.new的div会有一个蓝色背景，因为通过overflow: hidden属性创建了BFC, 根据上面第4条BFC表现规则，浮动元素的高度会参与父元素的高度的计算，所以闭合了浮动。

而另外一个div则会“坍塌”，看不到背景。

## BFC元素不会环绕float

根据第3条规则，产生一个新的BFC会改变元素与float元素的交互方式——这个元素将不再是环绕着float元素。与此同时，这个元素还会占据这一行剩下的所有空间。

利用这一点可以用来做自适应的双栏布局或者三栏布局。

例子：

[双栏布局](http://jsfiddle.net/kkeys/9RVnt/ "双栏布局")

[三栏布局](http://jsfiddle.net/kkeys/wS3pD/ "三栏布局")

# 参考

[http://www.cnblogs.com/pigtail/archive/2013/01/23/2871627.html](http://www.cnblogs.com/pigtail/archive/2013/01/23/2871627.html)

[http://outofmemory.cn/wr/?u=http%3A%2F%2Fkkeys.me%2Fpost%2F68547473290](http://outofmemory.cn/wr/?u=http%3A%2F%2Fkkeys.me%2Fpost%2F68547473290)