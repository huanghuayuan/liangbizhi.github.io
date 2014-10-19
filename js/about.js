var secondes = 0;
var preSecond = 0;

$(document).ready(function(){
	init();
	var $myFace = $("#myface");
	$myFace.click(function(){
		playAudio();
	});
});

/**
 * Initialize the UI.
 */
function init(){
	var $lyric = $("#lyric");
	var $descTxt = $(".desc");
	$descTxt.hide();
	$lyric.hide();
	$descTxt.fadeIn("slow");
}
/**
 * Play the music.
 */
function playAudio(){
	var audio = document.getElementById("myaudio");
	if(audio){
		$("#myface").fadeOut("slow");
		$(".desc").text("《爱してるばんぎーい》");
		$(audio).bind("playing", realPlay(audio));
	}else{
		$(".desc").text("HTML5 is not supported");
	}
}

/**
 * highlight the current lyric.
 */
function highlightLyric(){
	secondes++;
	var currentLineLyric = document.getElementById(secondes + "s");
	if(currentLineLyric){
		console.log(secondes);
		/* select the old highlight lyric line and remove the class attribute to remove the highlight style*/
		var $preLineLyric = $("#" + preSecond + "s");
		if($preLineLyric){
			$preLineLyric.removeAttr("class");
		}
		$(currentLineLyric).attr("class", "lyric-hl");
		preSecond = secondes;
	}
}

/**
 * Real play
 */
function realPlay(audio){
	$("#loading").fadeOut("fast");
	$("#lyric").fadeIn("slow");
	audio.play();
	setInterval(highlightLyric, 1000);
}
