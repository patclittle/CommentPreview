//For testing if it loaded
alert('Hello World!');

//Main method
function main(){
	insertButton();
}

//Inserts the expando button into the reddit page
function insertButton(){
	var button = document.createElement("a");
	$(button).addClass("commentExpander");
	button.innerText = "Expand";
	$(button).on("click",function(){
		console.log($(this).siblings(".flat-list").find(".comments").attr("href")+".json");
	});
	$('.tagline').before(button);
}


//Gets the comments for a given thread
function loadComments(theURL){

}


//Get everything going
main();
