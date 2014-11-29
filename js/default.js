/**
 * for default page.
 */
$(document).ready(function(){
	var nav		= $(".nav");
	var subMenu	= $(".submenu");
	var logo	= $("#logo");
	var backToTop	= $(".back-to-top");
	// back to top
	backToTop.hide();
	backToTop.click(function(){
		$("html, body").animate({scrollTop:0}, "fast");
	});
	// logo text events
	nav.mouseover(function(){
		displaySubMenu(subMenu);
	});
	nav.mouseout(function(){
		hideSubMenu(subMenu);
	});
	// submenu events
	/*subMenu.mouseover(function(){
		displaySubMenu(subMenu);
	});
	subMenu.mouseout(function(){
		hideSubMenu(subMenu);
	});*/

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
function displaySubMenu(menu){
	menu.stop(true, false).animate({"left" : 0}, 300);
}
function hideSubMenu(menu){
	menu.stop(true, false).animate({"left" : -menu.width() + 5}, 300);
}
