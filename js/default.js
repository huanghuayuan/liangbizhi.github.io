/**
 * for default page.
 */
$(document).ready(function(){
	var nav		= $(".nav");
	var backToTop	= $(".back-to-top");
	backToTop.hide();
	backToTop.click(function(){
		$("html, body").animate({scrollTop:0}, "fast");
	});
	//height of 'header' & following 'nav'.
	var topHeight	= nav.height();
	$(window).scroll(function(){
		if($(window).scrollTop() > topHeight){
			nav.addClass("nav-scroll");
		}else{
			nav.removeClass("nav-scroll");
		}
		if($(window).scrollTop() > (topHeight + 100)){
			backToTop.fadeIn("fast");
		}else{
			backToTop.fadeOut("fast");
		}
	});
});
