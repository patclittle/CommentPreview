alert('Hello World!');
var commentLinks = document.getElementsByClassName('comments');
for (i=0;i<commentLinks.length;i++){
	commentLinks[i].innerHTML = "Test";
}