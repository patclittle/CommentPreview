//Main method
function main(){
	insertExpandoButton();
}

//Inserts the expando button into the reddit page
function insertExpandoButton(){
	//Build the HTML element
	var button = document.createElement("a");
	$(button).addClass("commentExpander");
	button.innerText = "Expand";
	$(button).on("click",function(){
		insertCommentDiv($(this));
	});
	//Insert it into the page
	$('.tagline').before(button);
}

/* Inserts the comment content into the html.
 *
 * @param theButton is the button that created 
 * this div.
 */
function insertCommentDiv(theButton){
	var theURL; //the JSON url for the thread
	var commentDiv; //the div to display comments with
	//Initialize the JSON URL
	theURL = $(theButton).siblings(".flat-list").find(".comments").attr("href")+".json";
	//Build the container div
	commentDiv = document.createElement("div");
	$(commentDiv).addClass("commentContent");
	//Get comments and write to div
	$.getJSON(theURL,function foo(result) {
		$.each(result[1].data.children.slice(0, 100),
		    function (i, post) {
		        $(commentDiv).append("<p>"+post.data.body+"</p>");
		    }
	    )
	})
	//Add the div to the page
	&(theButton).siblings(".flat-list").after(commentDiv);


}

//Get everything going
main();
