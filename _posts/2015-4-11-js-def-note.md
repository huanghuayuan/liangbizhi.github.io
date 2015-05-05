---
layout: post
title: 《JavaScript权威指南》复习笔记
categories: 前端
tags: 学习
comments: true
---

# 数据类型和值

* 标记符命名规则：第一个字符必须是字母、下划线(_)或美元符号($)。

* 特殊的数值

	当一个算术运算产生了未定义的结果或错误时，返回的时`NaN`。它与任何数都不相等，包括他自己。`isNaN()`可用来检测该值。`isFinite()`函数可以用来检测一个数字是否是`NaN`、正无穷大或负无穷小。

	|常量                       |含义                             |
	|:--------------------------|:-------------------------------|
	|Infinity                   |表示无穷大的特殊值                |
	|NaN                        |特殊的非数字值                    |
	|Number.MAX_VALUE           |可表示的最大数字                  |
	|Number.MIN_VALUE           |可表示的最小数字（与0最接近的数字）  |
	|Number.NaN                 |特殊的非数字值                    |
	|Number.POSITION_INFINITY   |表示正无穷大的特殊值               |
	|Number.NEGATIVE_INFINITY   |表示负无穷大的特殊值               |

* 常规数组以非负整数作为下标，而关联数组则用字符串作为下标。JavaScript并不支持多维数组，不过他的数组元素还可以是数组。数组元素不必是相同类型的数据。

* undefined和null值虽然不同，但==运算结果为true。如果非要区分null和undefined，可以使用===运算符或typeof运算符。

* Date对象的构造器中，月份是从0开始计算的。所以取值为0-11。比如2015年的圣诞节：`var xmas = new Date(2015, 11, 25)`。

* 正则表达式RegExp对象有一个直接量语法。一对斜线之间的文本就构成了一个正则表达式直接量。斜线对中的第二个斜线之后还可以跟有一个或多个字母，它们改变了	模式的含义。

	/^HTML/
	/[1-9][0-9]*/
	/\bjavascript\b/i

* 每个Error对象具有一个message属性，他存放的是JavaScript实现特定的错误消息。

* **基本数据类型的包装对象**。三个基本数据类型（string、boolean和number）都有一个相应的对象类，即分别是Number、String、Boolean。

{% highlight javascript linenos %}
	var s = "These are the times that try people's souls.";
	var last_world = s.substring(s.lastIndexOf(" ") + 1, s.length);
{% endhighlight %}

常见数据类型typeof：

|字符串直接量|布尔直接量|数字直接量|null  |undefined|函数     |数组   |
|:----------|:-------|:--------|:-----|:---------|:-------|:-----|
|string     |boolean |number   |object|undefined |function|object|

既然字符直接量是string，而对象是object类型，为什么字符串的操作采用对象的表示法呢？原来在对象环境中使用字符串时，会创建一个瞬态的String对象，操作完之后就被丢弃了。要使用`new String("some text")`来显示地创建字符串对象。

# 变量

* 给未用var声明的变量赋值，JavaScript将隐式声明该变量为全局变量。

* **没有块级作用域**。函数中声明的所有变量在整个函数中都有定义。

{% highlight javascript linenos %}
	function test(o) {
		var i = 0;							// i 在整个函数中有定义
		if(typeof o == 'object') {
			var j = 233;						// j 到处都有定义，不仅限于此代码块
			for(var k = 0; k < 10; k++) {	// k 到处都有定义，不仅限于此循环
				document.write(k);
			}
			document.write(k);				// k 仍然用定义，输出10
		}
		document.write(j);					// j 仍然有定义，输出233
	}
{% endhighlight %}

这里规则可以产生惊人的效果：

{% highlight javascript linenos %}
	var scope = "global";
	function f() {
		alert(scope);			// 显示undefined
		var scope = "local";	// 如改成scope = "local"则会出错！原因详见下一个知识点
		alert(scope);			// 显示local
	}
{% endhighlight %}

由于这个作用域规则的限制，局部变量在整个函数体内都是有定义的，它隐藏了同名的全局变量。但是在执行var语句之前，它是不会被初始化的，也就是undefined了。	

* 使用未被声明的变量将引发错误。

{% highlight javascript linenos %}
	var x;		// 声明一个未赋值的变量，值为undefined
	alert(u);	// 使用未被声明的变量将引发错误
	u = 3;		// 给未声明的变量赋值，将创建该变量
{% endhighlight %}

* 我们可以将数据类型分为基本类型和引用类型。数值、布尔值、null和undefined属于基本类型；对象、数值和函数属于引用类型。基本类型在内存中具有固定的大小；引用类型通常引用的形式是指针或内存地址。字符串是基本类型还是引用类型令人费解，它是一个特例。

* 作用域链。作用域是一个对象列表或对象链。

![作用域链和变量解释](/media/images/js-def-note/scope-chain.jpg "作用域链和变量解释")

# 表达式和运算符

* 由于所有的数字都是浮点型的，所以除法结果也都是浮点型的，这与其他语言不同。如5/2=2.5，而不是2。除数为0结果为正/负无穷。0/0将是NaN。

* 模运算适用于浮点数。

* **相等运算（==）和等同运算符（===）**，内容较多，详见书本。

* 比较运算符（<、>、<=、>=）。比较运算符**只能**在数字和字符串上执行，否则运算数将会被转换成数字或字符串。一个特例是当某个运算数是（或被转换为）NaN时，四个比较运算符都返回false。

* in比较运算符

* instanceof比较运算符

* +运算符给予字符串运算数的优先级比数字运算数的高。

{% highlight javascript linenos %}
	1 + 2;		// 加法，结果为3
	"1" + "2";	// 连接运算，结果为“12”
	1 + "2";	// 连接运算，结果为“12”，1被转换为“1”
{% endhighlight %}	

* 逻辑运算符(&&)和(||)。&&将先计算第一个运算数，如果这个表达式可被转换成false，那么运算符将会返回左边表达式的值。否则，它将会计算第二个运算数，并返回该值；||将先计算第一个运算数，如果这个表达式可被转换成true，那么运算符就会返回左边表达式的值。否则，它将会计算第二个运算数，并返回该值。

* **delete运算符**。是个一元运算符，它将删除运算符所指定的对象的属性、数组元素或变量（注意这里的delete并不是C++的显式释放内存操作，JavaScript有垃圾回收机制）。但并非所有属性和变量都可以删除的，某些内部核心属性和客户端属性不能删除，用var语句声明的变量也不能被删除。如果delete使用的运算数是一个不存在的属性，它将返回true（ECMAScript标准规定，当delete运算数不是属性、数组元素或变量时，它返回true）。注意，删除属性、变量或数组元素不只是把它们的值置为undefined。当删除的是一个属性后，该属性将不再存在。

{% highlight javascript linenos %}
	var o = {x: 1, y: 2};	// 定义一个变量，把它初始化为一个对象
	delete o.x;				// 删除一个对象属性，返回true
	typeof o.x;				// 该属性不存在，返回undefined
	delete o.x;				// 删除一个不存在的属性，返回true
	delete o;				// 不能删除，返回true
	delete 1;				// 不能删除整数，返回true
	x = 1;					// 隐式地声明一个变量
	delete x;				// 不能删除，置值为undefined，返回true
	x;						// 错误，x未定义
{% endhighlight %}	

* void运算符。一元运算符，可出现在任何类型操作数之前。它总是舍弃运算数的值，然后返回undefined。

# 语句

* switch语句。case关键字后常用的是跟随数字和字符串，但ECMAScript v3标准允许为任意表达式。匹配case是用===等同运算符来判定的。

* for / in循环。它的循环主体对object的每个属性执行一次。在循环体执行之前，对象的属性名会被作为**字符串**赋给变量variable。在循环体内部，可以使用这个变量和“[]”运算符来查询该对象属性的值。例如：

{% highlight javascript linenos %}
	for(var prop in myObject) {
		document.write('name: ' + prop + '; value: ' + myObject[prop]);
	}
{% endhighlight %}

如果object为数组，那么枚举的是数组下标数值，比如0、1、2等。

* 标签语句。任何语句都可以通过在它前面加上标记符和冒号来标记：`identifier: statement`。多用于循环标记，给循环标记后，就可以使用break或continue来控制循环流程。

* function语句。函数是在实际运行之前，当JavaScript代码被解释或者被编译时定义的。当JavaScript解释程序遇到一个函数定义时，它就解析并存储（不执行）构成函数主体的语句，然后定义一个和该函数同名的属性（如果函数定义在嵌套在其他函数中，那么就在调用对象中定义这个属性，否则在全局对象中定义这个属性）以保存它。

函数定义在解释时发生，而不是运行时。

{% highlight javascript linenos %}
	alert(f(4));			// 显示16，可以在定义f()前调用它
	var f = 0;				// 重写属性f
	function f(x) {			// 定义执行的函数
		return x * x;		
	}
	alert(f);				// 显示0，函数f()已经被变量f覆盖了
{% endhighlight %}

* 函数return语句后面如果没有表达式值，直接`return;`（或没有return语句），那么函数调用后返回的值是`undefined`。

* `throw`和`try/catch/finally`语句。详见书本。

* with语句。`with(object){statement}`能够有效的将object添加到作用域链的头部，执行statement之后，再把作用域链恢复到原始状态。建议不使用此语句。

# 函数

* JavaScript不会检测传递给它的参数个数是否正确。如果传递的参数比函数需要的个数多，那么多余的值会被忽略掉。如果过少，那么多余的几个参数就会被赋予undefined。

* Function()构造函数。它可接受任意个数字符串参数，它最后一个参数是函数主体，其中可以包含任何JavaScript语句，语句之间用分号分隔。其他都是用来说明函数要定义的形式参数名的字符串。构造函数存在的一个意义就是可以动态地建立和编译一个函数，它不会将我们限制在function语句预编译函数体中。

{% highlight javascript linenos %}
	var f = new Function("x", "y", "return x + y;");
{% endhighlight %}

* arguments[]数组和命了名的参数不过是引用了同一变量的两种不同方法，所以像`arguments[0] = null`这样的语句是会改变第一个实参的。

* Arguments对象定义了callee属性，用来引用当前正在执行的函数。

* 函数的属性：`length`和`prototype`。方法：`aplly()`和`call()`。

* 函数属性length。表示该函数声明的形式参数的个数。如：

{% highlight javascript linenos %}
	function check(args) {
		var actual = args.length;
		var expected = args.callee.length;
		if(actual != expected) {
			throw new Error("实参个数：" + actual + "，形参个数：" + expected);
		}
	}
	function f(x, y, z) {
		check(arguments);
		return x + y + z;
	}
{% endhighlight %}

* 函数的方法`apply()`和`call()`。使用这两个方法可以像调用其他对象的方法一样调用函数。`apply()`和`call()`方法第一个参数都是调用的函数的对象，剩余参数是传递给要调用的函数的值，但`apply()`方法接受的是一个数组。

{% highlight javascript linenos %}
	func.call(object, 1, 2);	// 使用call()
	func.apply(object, [1, 2]);	// 使用apply()

	// 它们与下面的代码相似：
	object.method = func;
	object.method(1, 2);
	delete object.method;
{% endhighlight %}

# 对象

* 注意：for/in循环列出的属性并没有特定顺序，而且虽然它能枚举出所有的用户定义的属性，但是却不能枚举出某些预定义的属性或方法。

* 对象方法有个非常重要的属性，即在方法主体内部，关键字this的值就变成了调用该方法的对象。

* 当调用一个函数时，实际上调用的是全局对象的一个方法。在这样的函数中，关键字this引用的是全局对象。所以函数和方法的差别存在于设计和目的上，方法是用来对this对象进行操作的，而函数通常是独立的，并不需要使用this对象。

* **原型对象和继承**，**面向对象的JavaScript**，虽然JavaScript并没有正式的类的概念，但是它用构造函数和原型对象模拟了类。

* 类属性和类方法。它们与一个类关联起来，在JavaScript的命名空间拥有一个逻辑位置，防止出现命名冲突。由于类方法不能通过一个特定对象调用，所以使用关键字this对它来说没有意义。

* 定义类的一般步骤：
		
	1. 定义该类的构造函数。
	2. 在构造函数的原型对象中定义它的实例方法（或其他属性)。
	3. 定义类方法。

* 作为关联数组的对象。

* toString()方法。类Object定义的默认toString()方法能揭示一些有关内置对象的内部类型信息。默认总是返回`[object class]`字符串。class是对象的内部类型，通常对应该对象的构造函数名。例如Array对象的class为“Array”，Function对象的class为“Function”等。class值提供了typeof运行符不能提供的有用信息。

# 数组

* 数组元素的读和写。如果使用数组下标太大、或为负数、浮点数、布尔值、对象及其他值，JavaScript会将其转换为一个字符串，用生成的字符串作为对象属性的名字。例如：`a[-1.23] = true`将创建一个名为“-1.23”的属性。

* 数组的length属性既可读也可写。如果使用delete运算符来删除数组元素，虽然该元素变为undefined，但是length属性不会改变。

* sort()方法。默认以字母顺序排序，有必要时会将元素转成字符串再比较。

* 数组的各种方法。

# 正则表达式

* 字符串对象用于字符串模式匹配的方法。search()、replace()、match()、split()。
* RegExp对象用于模式匹配的方法。exec()、test()。
* RegExp对象实例属性。global、ignoreCase、multipleline。

# Document对象

* Document对象属性。
	1. URL、location
	2. title
	3. referer、lastModified
	4. domain
	5. cookie
	6. alinkColor、linkColor、vlinkColor
	7. bgColor、fgColor（只能在解释<body>标记之前设置它们）
	8. anchors[]
	9. applets[]
	10. forms[]
	11. images[]
	12. links[]

 * 如果与Form对象，Image对象或Applet对象对应的HTML标记中设定了name性质，就可以用名字来引用这些对象。如`document.f1`引用name属性为f1的form表单。

* 只能在当前文档正在解析时使用write()方法向其输出HTML代码。document.write()方法可以接受多个参数，这些参数会被依次写入文档。writeln()方法会在输出的参数之后附加一个换行符，但由于HTML忽略换行，所以它可以和非HTML文档一起使用更好。

* Form对象有一个elements[]属性，该属性包含代表表单中具有的HTML输入元素的对象。

# 表单和表单元素

* onsubmite()和onreset()方法，submit()和reset()方法。

* 如果<form>标记中定义了name性质，它除了会作为一个Document对象的数组forms[]的元素被存储外，还会被存储在一个Document对象的个人属性中。比如创建`<form name="form1">`，这样我们还可以使用`document.form1`来引用这个表单。另外<img>、<applet>和其他HTML标记也有name属性，它们的作用和<form>的name性质相同。**利用这一点可以快速定位一个具有name属性的表单元素。**

* Radio元素和Checked元素定义是否选中的是可读可写的checked属性。

* Select元素的则是selected属性。对于“单选”型的Select元素，可读可写的属性selectedIndex用数字指定了当前选中的选项；“多选”型的，则必须遍历options[]数组的所有元素是否去有selected属性。

* DOM API部分类层次。

* 节点Node接口。

	Node
	  |
	  |--属性：①firstChild、lastChild ②nextSibling、previousSibling ③childNodes parentNode
	  |       ④nodeType
	  |
	  |

# 级联样式表和动态HTML

* 使用CSS2Properties对象的样式属性时，所有值必须是字符串。所有定位属性都要求有单位。读取时这些属性的返回值是字符串，不是数字。CSS2Properties对象的属性表示该元素的内联样式性质。


# 事件和事件处理

* `event.button`0、1、2分别代表鼠标左中右键，IE8-（我知道的）的却是1、4、2

* keyDown：按下键盘上的任意键时触发，按住不放会重复触发该事件；keyPress：按下字符键时触发，按住不放会重复触发该事件；keyUp当用户释放键盘上的键时触发。