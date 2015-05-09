---
layout: post
title: Bootstrap栅格系统原理与使用
categories: 前端
tags: bootstrap css
comments: true
---

# 实现原理

通过定义容器大小，平均分为12份（可以重新编译LESS来修改此数值），在调整内外边距，结合Media Query就制作出了强大的响应栅格系统。

# 工作原理

1. 数据行(.row)必须包含在容器（.container）中，以便为其赋予合适的对齐方式和内距(padding)。如：

	<div class="container">
		<div class="row"></div>
	</div>

2. 在行(.row)中可以添加列(.column)，但列数之和不能超过平分的总列数，比如12。

3. 具体内容应当放置在列容器（column）之内，而且只有列（column）才可以作为行容器(.row)的直接子元素。

4. 通过设置内距（padding）从而创建列与列之间的间距。然后通过为第一列和最后一列设置负值的外距（margin）来抵消内距(padding)的影响。

观察下图：

![bootstrap grid](/media/images/bootstrap-grid-system/grid.jpg)

1. 最外边框，带有一大片白色区域，就是相当于浏览器的可视区域。在Bootstrap框架的网格系统中带有响应式效果，其带有四种类型的浏览器（超小屏，小屏，中屏和大屏），其断点（像素的分界点）是768px、992px和1220px。

2. 第二个边框(1)相当于容器(.container)。针对不同的浏览器分辨率，其宽度也不一样：自动、750px、970px和1170px。

3. ２号横条阐述的是，将容器的行（.row）平分了12等份，也就是列。每个列都有一个“padding-left:15px”(图中粉红色部分)和一个“padding-right:15px”(图中紫色部分)。这样也导致了第一个列的padding-left和最后一列的padding-right占据了总宽度的30px，从而致使页面不美观，当然，如果你需要留有一定的间距，这个做法是不错的。
 
4. ３号横条就是行容器(.row),其定义了“margin-left”和”margin-right”值为”-15px”，用来抵消第一个列的左内距和最后一列的右内距。

5. 将行与列给合在一起就能看到横条4的效果。也就是我们期望看到的效果，第一列和最后一列与容器（.container）之间没有间距。 

# 怎么实现列组合

实现列组合方式非常简单，只涉及两个CSS两个特性：**浮动**与**宽度百分比**。

在bootstrap.css文件中（以中屏为例）：

	/* 确保所有列左浮动 */
	.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {
	    float: left;
	}

	/* 定义每个列组合的宽度（使用的百分比） */
	  .col-md-12 {
	    width: 100%;
	  }
	  .col-md-11 {
	    width: 91.66666667%;
	  }
	  .col-md-10 {
	    width: 83.33333333%;
	  }
	  .col-md-9 {
	    width: 75%;
	  }
	  .col-md-8 {
	    width: 66.66666667%;
	  }
	  .col-md-7 {
	    width: 58.33333333%;
	  }
	  .col-md-6 {
	    width: 50%;
	  }
	  .col-md-5 {
	    width: 41.66666667%;
	  }
	  .col-md-4 {
	    width: 33.33333333%;
	  }
	  .col-md-3 {
	    width: 25%;
	  }
	  .col-md-2 {
	    width: 16.66666667%;
	  }
	  .col-md-1 {
	    width: 8.33333333%;
	  }

# 列偏移

有的时候，我们不希望相邻的两个列紧靠在一起，这个时候就可以使用列偏移（offset）功能来实现。使用列偏移也非常简单，只需要在列元素上添加类名“col-md-offset-*”(其中星号代表要偏移的列组合数)，那么具有这个类名的列就会向右偏移。

	<div class="container">
	    <div class="row">
	        <div class="col-md-2">2</div>
	        <div class="col-md-2 col-md-offset-1">2</div>
	        <div class="col-md-2 col-md-offset-1">2</div>
	        <div class="col-md-3 col-md-offset-1">3</div>
	    </div>
	</div>

的显示效果为：

![bootstrap grid](/media/images/bootstrap-grid-system/offset.jpg)

实现原理非常简单，就是利用十二分之一（1/12）的margin-left。然后有多少个offset，就有多少个margin-left。

	.col-md-offset-12 {
		margin-left: 100%;
	}
	.col-md-offset-11 {
		margin-left: 91.66666667%;
	}
	.col-md-offset-10 {
		margin-left: 83.33333333%;
	}
	/* ... */

**注意：**使用”col-md-offset-*”对列进行向右偏移时，要保证列与偏移列的总数不超过12，不然会致列断行显示。

# 列排序

push推开，pull拉回。列排序其实就是改变列的方向，就是改变左右浮动，并且设置浮动的距离。

	<div class="container">
	  <div class="row">
	    <div class="col-md-4">.col-md-4</div>
	    <div class="col-md-8">.col-md-8</div>
	  </div>
	</div>

![bootstrap grid](/media/images/bootstrap-grid-system/push-pull-1.jpg)

	<div class="container">
	  <div class="row">
	    <div class="col-md-4 col-md-push-8">.col-md-4</div>
	    <div class="col-md-8 col-md-pull-4">.col-md-8</div>
	  </div>
	</div>


![bootstrap grid](/media/images/bootstrap-grid-system/push-pull-2.jpg)

原理是通过设置left和right来实现定位效果。

	.col-md-push-8 {
		left: 66.66666667%;
	}
	.col-md-pull-4 {
		right: 33.33333333%;
	}

# 参考

[http://www.imooc.com/learn/141](http://www.imooc.com/learn/141)