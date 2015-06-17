---
layout: post
title: 高质量的HTML
categories: 前端
tags: html
comments: true
---

# 使用语义化标签

HTML标签的设计都是有语义考虑的。如`ul`表示unordered list，`li`表示list item等。但`div`和`span`其实没有语义的，它们只是分别用作块级元素和行内元素的区域分隔符。但设计它们是有目的的。

可以通过网页视觉上的效果来判断内容的语义，但是搜索引擎看不到视觉效果，看到的只是代码，只能通过标签来判断内容的语义。

HTML、CSS、JavaScript三大元素中，HTML才是最重要的，结构才是重点，样式使用来修饰结构的。先确定HTML，确定语义的标签，再来选用合适的CSS。

# 判断标签是否语义良好

如果一个网页不使用CSS，网页是不是就没有样式呢？不是的，浏览器会根据标签的语义给定一个默认的样式。

判断网页标签语义是否良好的一个简单方法是：去掉样式，看网页结构是否组织良好有序，是否仍然有很好的可读性。

Firefox插件Web Developer帮到你:-D

# 模块

## 表单

	<form action="" method="">
		<fieldset>
			<legend>登录表单</legend>
			<p><label for="name">账号：</label><input type="text" id="name" /></p>
			<p><label for="pw">密码：</label><input type="password" id="pw" /></p>
			<input type="submit" value="登录" />
		</fieldset>
	</form>

这是一个语义清晰的表单模块。

表单域要用`fieldset`标签包起来，并用`legend`标签说明表单的用途。

每个`input`标签对应的说明文本都需要使用`label`标签，并且通过为`input`设置`id`属性，在`label`标签中设置`for = someId`来让说明文本和相应的`input`关联起来。

## 表格

	<table border="1">
		<thead>
			<tr>
				<th>实现方式</th><th>代码量</th><th>搜索引擎友好</th><th>特殊终端兼容</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th>table布局</th><td>多</td><td>差</td><td>一般</td>
			</tr>
			<tr>
				<th>乱用标签的CSS布局</th><td>少</td><td>一般</td><td>差</td>
			</tr>
			<tr>
				<th>标签语义良好的CSS布局</th><td>少</td><td>好</td><td>好</td>
			</tr>
		</tbody>
	</table>

事实上，`table`常用的标签还包括`caption`、`thead`、`tbody`、`tfoot`和`th`。

表格标题要用`caption`，表头要用`thead`包围，主体部分用`tbody`包围，尾部要用`tfoot`包围，表头和一般单元格要区分开，表头用`th`，一般单元格用`td`。

# 一些注意问题

* 尽可能少地使用无语义的`div`和`span`。
* 在语义不明显，既可以用`p`也可以用`div`的地方，尽量用`p`，`p`默认情况下有上下间距，去样式后的可读性更好，对兼容特殊终端有利。
* 不要使用纯样式标签，如`b`、`font`和`u`等，改用CSS设置。语义上需要强调的文本可以包在`strong`或`em`标签里。

# 参考

[1] 曹刘阳 著；编写高质量代码：Web前端开发修炼之道 （Writing Solid Web Front-End Code）；机械工业出版社，2010