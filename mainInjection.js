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
		loadComments($(this).siblings(".flat-list").find(".comments").attr("href")+".json");
	});
	$('.tagline').before(button);
}


//Gets the comments for a given thread
function loadComments(theURL){
	$.getJSON(theURL,function foo(result) {
		$.each(result[1].data.children.slice(0, 100),
		    function (i, post) {
		        //$("#reddit-content").append( '<br>' + post.data.body );
		        //$("#reddit-content").append( '<hr>' );
		        console.log(post.data.body);
		    }
	    )
	})
}


//Get everything going
main();
