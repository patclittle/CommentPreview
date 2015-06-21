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
	button.src = chrome.extension.getURL('plusIconLight.png');
	//Add expanding functionality to button
	$(button).on("click",function(){
		if (this.className.includes("unexpanded")){ // expand the comments
			if (this.className.includes("opened")){ // if already opened
				$(this).siblings(".commentContent").show(); //just show the div
			}else{ // if not already opened
				insertCommentDiv($(this)); // open and show comments
			}
			//Change around the button to be a collapse
			this.src = chrome.extension.getURL('minusIconLight.png');
			this.className = "commentExpander opened";
		}else{ // unexpand comments
			$(this).siblings(".commentContent").hide();
			//Change button to be an expand
			this.src = chrome.extension.getURL('plusIconLight.png');
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
	var loadingText;//HTML for loading text
	var colorCode; //code for the bg color of the comment
	var index; //keeps track of index of comment
	var numToShow; //the number of comments to show
	var childList; //list of comments
	//Initialize the JSON URL
	theURL = $(theButton).siblings(".flat-list").find(".comments").attr("href")+".json";
	//Build the container div
	commentDiv = document.createElement("div");
	$(commentDiv).addClass("commentContent");
	//Add loading text to div while comments load
	loadingText=document.createElement("a");
	$(loadingText).addClass("bottomText loading");
	//Add the div to the page
	$(theButton).siblings(".flat-list").after(commentDiv);
	$(commentDiv).append(loadingText);
	//Set color code as 0 to start (arbitrary)
	colorCode=1;
	//Get comments and write to div
	$.getJSON(theURL,function foo(result) {
		childList=result[1].data.children;
		//Insert first batch of comments
		numToShow = (childList.length<5) ? childList.length:5;
	    insertComments(numToShow,0,childList,loadingText);
	    //Add link to load more comments
	    $(loadingText).removeClass("loading").addClass("loadMore");
	    $(loadingText).data("index",5);
	    $(loadingText).on("click",function(){
	    	index = $(this).data("index");
	    	console.log(index,childList.length);
	    	numToShow = (childList.length<index+5) ? childList.length-index:5;
	    	console.log(numToShow);
	    	insertComments(numToShow,index,childList,this);
	    	if (numToShow==5) {
	    		$(this).data("index",index+5);
	    	}else{
	    		$(this).hide();
	    	}
	    });
	})
}

/*
 * Inserts a specific comment in a specific place
 * @param data is the data of the comment from the JSON
 * @param context is the context of where to insert the comment
 *     (comment will go directly before the context)
 * @colorCode is the code for the bg color
 *     (1 for EFF7FF, 0 for FFFFFF)
 */
function insertComment(data,context,colorCode){
	var commentHTML; //DOM object for comment
	var repliesLink; //Dom object for replies link
	var replyNum; //for keeping track of how many replies have been loaded

	//Set up comment
	commentHTML=$('<div/>').html(data.body_html).text();
	commentHTML=$.parseHTML(commentHTML);
	$(commentHTML).prepend("<a href=\"/user/"+data.author+"\">"+data.author+"</a> "+data.score+" points");
	if (colorCode==1){
		$(commentHTML).addClass("commentA");
	}else{
		$(commentHTML).addClass("commentB");
	}

	//Add "load replies" button if necessary
	if(data.replies!=""){ //Check if there are replies
		if(data.replies.data.children[0].kind!="more"){ //Check if the reply is already loaded
			//Create button to load a reply
			repliesLink=document.createElement('a');
			repliesLink.innerText="Load more comments...";
			repliesLink.className="0";

			//Add functionality to button
			$(repliesLink).on("click",function(){
				insertComment(data.replies.data.children[this.className].data,repliesLink,colorCode^1);
				//keep track of which number reply we are at with class name
				replyNum = (+this.className)+1;
				if(replyNum<data.replies.data.children.length && data.replies.data.children[replyNum].kind!="more"){ //if there are more replies to load
					this.className = replyNum; // get ready to load next reply
				}else{
					$(this).hide(); // otherwise hide the button
				}
			});

			//Add button to the comment
			$(commentHTML).append(repliesLink);
		}
	}

	//insert the comment before the context
	$(context).before(commentHTML);
}

function insertComments(numComments, offset, childrenList, context){
	var colorCode; //code for bg color of comment

	colorCode=1;//arbitrarily initialize as 1

	//Loop running through all top replies
	$.each(childrenList.slice(offset, offset+numComments),
	    function (i, post) {
	    	//insert comment
	        insertComment(post.data,context,colorCode);
	        colorCode=colorCode^1;//for alternating BG colors
	    }
    )
}

//Get everything going
main();
