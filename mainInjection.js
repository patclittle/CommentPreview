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
	var desiredAdd; // desired amount of comments to add
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

	//Default, add 5 comments
	desiredAdd=5
	//Get comments and write to div
	$.getJSON(theURL,function foo(result) {
		childList=result[1].data.children;
		$(loadingText).data("index",0);
		$(loadingText).removeClass("loading").addClass("loadMore");
	    $(loadingText).on("click",function(){
	    	loadReplies(this,result[1].data.children,desiredAdd,colorCode);
	    	colorCode = (desiredAdd%2==0) ? colorCode : colorCode^1;
	    });
	    loadingText.click();
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
			repliesLink.className="loadReplies";
			$(repliesLink).data("index",0);

			//Add functionality to button
			$(repliesLink).on("click",function(){
				loadReply(this,data.replies.data.children,colorCode);
			});

			//Add button to the comment
			$(commentHTML).append(repliesLink);
		}
	}

	//insert the comment before the context
	$(context).before(commentHTML);
}

/*
 * Loads and inserts a reply, and sets up the reply link
 * to load more comments if necessary
 * @param context is the reply link to load for
 * @param childList is the list of replies/comments
 * @colorcode is 1 or 0 for bg color of the div
 */
function loadReply(context,childList,colorCode){
	var index;//the index of the reply

	index = $(context).data("index");//fetch index
	//Insert the comment
	insertComment(childList[index].data,context,colorCode^1)

	//Check if there are more comments to load, update 
	//index if necessary
	index++;
	if (index<childList.length && childList[index].kind!="more") {
		$(context).data("index",index);
	}else{
		$(context).hide();
	}
}

/*
 * Loads multiple replies (using the loadReply function)
 * @param context is the reply link to load for
 * @param childList is the list of replies/comments
 * @param desiredLoad is the desired amount of comments to load
 * @param colorCode is 1 or 0 for the bg color of the div
 */
function loadReplies(context,childList,desiredLoad,colorCode){
	var index; //index of the reply
	var actualLoad; //the actual amount of comments to load

	index = $(context).data("index");//fetch index

	//Calculate how many replies can actually be loaded
	actualLoad = (index+desiredLoad <= childList.length) ? desiredLoad : childList.length-index;

	//Load up the replies
	for(i=index;i<index+actualLoad;i++){
		if(childList[i].kind!="more"){
			loadReply(context,childList,colorCode);
			colorCode=colorCode^1;
		}else{
			$(context).hide();
		}
	}
}

//Get everything going
main();
