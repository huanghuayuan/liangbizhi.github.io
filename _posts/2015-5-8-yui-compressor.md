---
layout: post
title: 使用YUI Compressor
categories: 前端
tags: 工具 css javascript
comments: true
---

# 为什么要压缩

1. 减少了文件体积。
2. 减少网络传输和宽带占用。
3. 减轻了服务器的处理压力。
4. 提高了页面的渲染显示速度。
5. 对文件有一定的保护作用。 

# 如何工作

YUI Compressor使用纯Java编写，运行需要JDK1.4或更高版本，基于Rhino 对JavaScript源文件进行分析和切词。可以是去掉JavaScript文件和CSS文件中冗余的空白字符（空格，换行符，制表符），对于JavaScript文件还可以对其进行混淆，更改局部变量的名称，将它们改成长度为1,2或3的字符，总之是尽量短。对于 CSS，还有采用优化0值属性值的表示，优化颜色值的方法压缩文件。

从YUI Compressor官网下载`yuicompressor-2.4.8.jar`文件到本地既可使用。

# 命令行中使用YUI Compressor

	$ java -jar yuicompressor-x.y.z.jar
	Usage: java -jar yuicompressor-x.y.z.jar [options] [input file]
	
	  Global Options
	    -h, --help                Displays this information
	    --type <js|css>           Specifies the type of the input file
	    --charset <charset>       Read the input file using <charset>
	    --line-break <column>     Insert a line break after the specified column number
	    -v, --verbose             Display informational messages and warnings
	    -o <file>                 Place the output into <file> or a file pattern.
	                              Defaults to stdout.
	
	  JavaScript Options
	    --nomunge                 Minify only, do not obfuscate
	    --preserve-semi           Preserve all semicolons
	    --disable-optimizations   Disable all micro optimizations
	
	GLOBAL OPTIONS
	
	  -h, --help
	      Prints help on how to use the YUI Compressor
	
	  --line-break
	      Some source control tools don't like files containing lines longer than,
	      say 8000 characters. The linebreak option is used in that case to split
	      long lines after a specific column. It can also be used to make the code
	      more readable, easier to debug (especially with the MS Script Debugger)
	      Specify 0 to get a line break after each semi-colon in JavaScript, and
	      after each rule in CSS.
	
	  --type js|css
	      The type of compressor (JavaScript or CSS) is chosen based on the
	      extension of the input file name (.js or .css) This option is required
	      if no input file has been specified. Otherwise, this option is only
	      required if the input file extension is neither 'js' nor 'css'.
	
	  --charset character-set
	      If a supported character set is specified, the YUI Compressor will use it
	      to read the input file. Otherwise, it will assume that the platform's
	      default character set is being used. The output file is encoded using
	      the same character set.
	
	  -o outfile
	
	      Place output in file outfile. If not specified, the YUI Compressor will
	      default to the standard output, which you can redirect to a file.
	      Supports a filter syntax for expressing the output pattern when there are
	      multiple input files.  ex:
	          java -jar yuicompressor.jar -o '.css$:-min.css' *.css
	      ... will minify all .css files and save them as -min.css
	
	  -v, --verbose
	      Display informational messages and warnings.
	
	JAVASCRIPT ONLY OPTIONS
	
	  --nomunge
	      Minify only. Do not obfuscate local symbols.
	
	  --preserve-semi
	      Preserve unnecessary semicolons (such as right before a '}') This option
	      is useful when compressed code has to be run through JSLint (which is the
	      case of YUI for example)
	
	  --disable-optimizations
	      Disable all the built-in micro optimizations.

**注意：**如果没有指定输入文件，默认从`stdin`输入流读取。

	$ java -jar yuicompressor-x.y.z.jar myfile.js -o myfile-min.js

上面的命令将压缩`myfile.js`文件，并输出`myfile-min.js`。