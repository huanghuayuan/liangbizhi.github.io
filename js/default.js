/**
 * for default page.
 */
$(document).ready(function(){
	var nav		= $(".nav");
	var logo	= $(".logo");
	var backToTop	= $(".back-to-top");
	var follows	= $("#follow").children();
	backToTop.hide();
	backToTop.click(function(){
		$("html, body").animate({scrollTop:0}, "fast");
	});
	logo.click(function(){
		window.location.href = "/";
	});
	//height of 'header' & following 'nav'.
	var topHeight	= nav.height();
	$(window).scroll(function(){
		follows.each(function(item){
			$(this).css("margin", ($(this).parent().height() - $(this).height()) / 2 + "px 0");
		});
		if($(window).scrollTop() > topHeight){
			nav.addClass("nav-scroll");
			logo.removeClass("logo");
			logo.addClass("logo-scroll");
			logo.text("必苦其心志");
		}else{
			nav.removeClass("nav-scroll");
			logo.removeClass("logo-scroll");
			logo.addClass("logo");
			logo.text("");
		}
		if($(window).scrollTop() > (topHeight + 100)){
			backToTop.fadeIn("fast");
		}else{
			backToTop.fadeOut("fast");
		}
	});
});
