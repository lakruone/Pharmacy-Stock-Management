
$(document).ready(function(){
	
  $('.header').height($(window).height());
})



var myVar;

function myFunction() {

		var user = getCookie("loaded");

	if (user != "") {

		// setCookie("loaded","1",1000);
		showPage();
		// myVar = setTimeout(showPage, 3000);
	}else{
		// showPage();
		setCookie("loaded","1",1);
		myVar = setTimeout(showPage, 3000);
	}
  
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
 }



 function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}




