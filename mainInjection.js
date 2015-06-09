//Main method
function main(){
	insertExpandoButton();
}

//Inserts the expando button into the reddit page
function insertExpandoButton(){
	//Build the HTML element
	var button = document.createElement("a");
	//Add class for keeping track of expanding
	$(button).addClass("commentExpander unexpanded");
	button.innerText = "Expand";
	//Add expanding functionality to button
	$(button).on("click",function(){
		if (this.className.includes("unexpanded")){ // expand the comments
			if (this.className.includes("opened")){ // if already opened
				$(this).siblings(".commentContent").show(); //just show the div
				this.className = "commentExpander opened";
			}else{ // if not already opened
				insertCommentDiv($(this)); // open and show comments
				this.className = "commentExpander opened";
			}
		}else{ // unexpand comments
			$(this).siblings(".commentContent").hide();
			this.className = "commentExpander opened unexpanded";
		}
	});
	//Insert expando button into the page
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
	var commentHTML;
	//Initialize the JSON URL
	theURL = $(theButton).siblings(".flat-list").find(".comments").attr("href")+".json";
	//Build the container div
	commentDiv = document.createElement("div");
	$(commentDiv).addClass("commentContent");
	//Get comments and write to div
	$.getJSON(theURL,function foo(result) {
		$.each(result[1].data.children.slice(0, 100),
		    function (i, post) {
		    	commentHTML=$('<div/>').html(post.data.body_html).text();
		        $(commentDiv).append(commentHTML+'<hr/>');
		    }
	    )
	})
	//Add the div to the page
	&(theButton).siblings(".flat-list").after(commentDiv);


}

//Get everything going
main();
