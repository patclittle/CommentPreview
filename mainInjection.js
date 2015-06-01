//For testing if it loaded
alert('Hello World!');
//List of links to comment pages
var commentLinks;

//Main method
function main(){
	fillCommentLinks();
	for (i=0;i<commentLinks.length;i++){
		commentLinks[i].innerHTML = "Test";
	}
}

//Gets all the links to coment pages and arranges in array
function fillCommentLinks(){
	commentLinks = document.getElementsByClassName('comments');
}

//Get everything going
main();
