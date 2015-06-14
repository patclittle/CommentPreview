//Main method
function main(){
	insertExpandoButton();
}

//Inserts the expando button into the reddit page
function insertExpandoButton(){
	//Build the HTML element
	var button = document.createElement("img");
	//Add class for keeping track of expanding
	$(button).addClass("commentExpander unexpanded");
	button.src = chrome.extension.getURL('plusIcon.png');
	//Add expanding functionality to button
	$(button).on("click",function(){
		if (this.className.includes("unexpanded")){ // expand the comments
			if (this.className.includes("opened")){ // if already opened
				$(this).siblings(".commentContent").show(); //just show the div
			}else{ // if not already opened
				insertCommentDiv($(this)); // open and show comments
			}
			//Change around the button to be a collapse
			this.src = chrome.extension.getURL('minusIcon.png');
			this.className = "commentExpander opened";
		}else{ // unexpand comments
			$(this).siblings(".commentContent").hide();
			//Change button to be an expand
			this.src = chrome.extension.getURL('plusIcon.png');
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
		    	commentHTML=$.parseHTML(commentHTML); //Make the comment into an HTML object
		    	$(commentHTML).prepend("<a href=\"www.reddit.com/user/"+post.data.author+"\">"+post.data.author+"</a> "+post.data.score+" points");
		    	$(commentHTML).addClass("commentP");
		    	if(post.data.replies != ""){ // If there are replies to this comment
		    		insertReplies(post.data.replies,commentHTML);	
		    	}
		        $(commentDiv).append($(commentHTML)); //Add comment content to page
		    }
	    )
	})
}


/*Inserts the replies into the thread
 * @param post is the comment to load replies for
 * @param context is the html object for the comment to load replies for
 */
function insertReplies(post,context){
	var moreComments; //HTML object for the "load more comments" button
	var replyHTML; //HTML for the first reply
	var theReply; //the reply to load
	var replyNum; //the number of reply in the thread

	moreComments=document.createElement('a'); //link to load replies
	moreComments.innerText = "Load more comments...";
	moreComments.className = "0";
	$(moreComments).on("click",function(){ //Make the link load replies
		console.log(post);
		theReply = post.data.children[this.className].data;
		replyHTML=$('<div/>').html(theReply.body_html).text(); 
		replyHTML=$.parseHTML(replyHTML); //Build the HTML from the JSON
		$(replyHTML).prepend("<a href=\"www.reddit.com/user/"+theReply.author+"\">"+theReply.author+"</a> "+theReply.score+" points")
		$(replyHTML).addClass("commentP");
		$(this).parent().before($(replyHTML)); //insert comment
		if (theReply.replies != ""){ // If there are replies to this reply
			if(theReply.replies.data.children[0].kind != "more"){
				insertReplies(theReply.replies,replyHTML); // load those replies
			}
		}
		//keep track of which number reply we are at with class name
		replyNum = (+this.className)+1;
		if(replyNum<post.data.children.length-1){ //if there are more replies to load
			this.className = replyNum; // get ready to load next reply
		}else{
			$(this).hide(); // otherwise hide the button
		}
	});
	$(context).append($('<span/>').html($(moreComments)));
}

//Get everything going
main();
