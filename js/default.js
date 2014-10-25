/**
 * for default page.
 */
$(document).ready(function(){
	var nav		= $(".nav");
	var logo	= $("#logo");
	var backToTop	= $(".back-to-top");

	backToTop.hide();
	backToTop.click(function(){
		$("html, body").animate({scrollTop:0}, "fast");
	});
	logo.click(function(){
		window.location.href = "/";
	});
	nav.mouseover(function(){
		displaySubMenu();
	});
	nav.mouseout(function(){
		hideSubMenu();
	});
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

/**
 * javascript related to menu.
 */
function displaySubMenu(){
	var subMenu = $(".submenu");
	subMenu.stop(true, false).animate({"left" : 0}, 300);
}
function hideSubMenu(){
	var subMenu = $(".submenu");
	subMenu.stop(true, false).animate({"left" : -subMenu.width() + 5}, 300);
}
