---
layout: post
title: JavaScript六种数据类型与类型检测
categories: 前端
tags: javascript
comments: true
---

# 六种数据类型

五个原始类型：

number、string、boolean、null和undefined。

加上object对象类型。（object-->Function、Array、Date...）

# 类型检测

## typeof

它非常适合基本类型和函数对象的判断。

{% highlight javascript linenos %}
	typeof 100			"number"
	typeof true			"boolean"
	typeof function		"function"
	typeof (undefined)	"undefined"
	typeof new Object()	"object"
	tpyeof [1, 2]		"object"
	typeof NaN			"number"
	typeof null			"object"
{% endhighlight %}

## instanceof

它是基于原型链来判断的操作符。它期望左操作数是对象类型（如果左操作数是基本类型则直接返回false），右操作数是一个函数对象或函数构造器（否则抛出TypeError）。

原理：它会判断左操作数对象的原型链上是否有右操作数的prototype属性。

注意：不同window或iframe之间的对象类型检测不能使用instanceof。

适用于对象的判断。

## Object.prototype.toString

{% highlight javascript linenos %}
	Object.prototype.toString.apply([]) === '[object Array]'
	Object.prototype.toString.apply(function(){}) === '[object Function]'
	Object.prototype.toString.apply(null) === '[object Null]'
	Object.prototype.toString.apply(undefined) === '[object Undefined]'
	
	// IE6/7/8
	Object.prototype.toString.apply(null) === '[object Object]'
{% endhighlight %}

## constructor

每一个对象都有一个constructor属性，它会指向构造该对象的构造函数。constructor是可以被改写的，使用时要小心。

## duck type

鸭子类型。例如判断一个对象是否是数组，可以判断它的length是不是数字，是否有join、push等方法。

## 练习例子

编写arraysSimilar函数，实现判断传入的两个数组是否相似。具体需求：
1. 数组中的成员类型相同，顺序可以不同。例如[1, true] 与 [false, 2]是相似的。
2. 数组的长度一致。
3. 类型的判断范围，需要区分:String, Boolean, Number, undefined, null, 函数，日期, window.

{% highlight javascript linenos %}
	/*
     * param1 Array 
     * param2 Array
     * return true or false
     */
    function arraysSimilar(arr1, arr2){
        if(!(arr1 instanceof Array) || !(arr2 instanceof Array))
            return false;
        if(arr1.length !== arr2.length)
            return false;
        var i = 0,
            n = arr1.length,
            countMap1 = {},
            countMap2 = {},
            t1,
            t2,
            TYPES = ['string', 'boolean', 'number', 'null', 'undefined', 'function', 'date', 'window'];
        for(; i < n; i++){
            t1 = typeOf(arr1[i]);
            t2 = typeOf(arr2[i]);
            if(countMap1[t1])
                countMap1[t1]++;
            else
                countMap1[t1] = 1;
            if(countMap2[t2])
                countMap2[t2]++;
            else
                countMap2[t2] = 1;
        }
        
        for(i = 0, n = TYPES.length; i < n; i++) {
            if(countMap1[TYPES[i]] !== countMap2[TYPES[i]])
                return false;
        }
        return true;
        
        function typeOf(ele) {
            var r;
            if(ele === null) r = 'null';
            else if(ele instanceof Array) r = 'array';
            else if(ele instanceof Date) r = 'date';
            else if(ele === window) r = 'window';
            else r = typeof(ele);
            return r;
        }
    }
{% endhighlight %}