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
			}else{ // if not already opened
				insertCommentDiv($(this)); // open and show comments
			}
			//Change around the button to be a collapse
			this.innerText = "Collapse";
			this.className = "commentExpander opened";
		}else{ // unexpand comments
			$(this).siblings(".commentContent").hide();
			//Change button to be an expand
			this.innerText = "Expand";
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
	var commentHTML; //HTML for the comments to add
	var moreComments; //HTML object for the "load more comments" button
	//Initialize the JSON URL
	theURL = $(theButton).siblings(".flat-list").find(".comments").attr("href")+".json";
	//Build the container div
	commentDiv = document.createElement("div");
	$(commentDiv).addClass("commentContent");
	//Add the div to the page
	$(theButton).siblings(".flat-list").after(commentDiv);
	//Get comments and write to div
	$.getJSON(theURL,function foo(result) {
		//Loop running through all top replies
		$.each(result[1].data.children.slice(0, 100),
		    function (i, post) {
		    	commentHTML=$('<div/>').html(post.data.body_html).text(); //comment content
		    	commentHTML=$.parseHTML(commentHTML);
		    	if(post.data.replies != ""){ // If there are replies to this comment
		    		moreComments=document.createElement('a'); //link to load replies
		    		moreComments.innerText = "Load more comments...";
		    		$(commentHTML).append("<span>"+moreComments.outerHTML+"</span>"); //Add link to comment
		    		$(moreComments).on("click",function(){ //Make the link load replies
		    			$(commentHTML.firstChild).append("<div style=\"margin-left:10px;\">"+post.data.replies.data.children[0].data.body+"</div>");
		    		});
		    		
		    	}
		    	$(commentHTML).append("<hr/>");
		        $(commentDiv).append($(commentHTML)); //Add comment content to page
		    }
	    )
	})


}

//Get everything going
main();
