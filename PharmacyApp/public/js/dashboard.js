$(document).ready(function(){

	$('.lk-add-sale').click (function(e){
		location.href = "/addSale";
	});

	$('.lk-add-new-product').click (function(e){
		location.href = "/addNewproduct";
	});

	$('.lk-view-sale').click (function(e){
		location.href = "/viewSale";
	});

	$('.lk-update-sale').click (function(e){
		location.href = "/updateSale";
	});

	$('.lk-product-list').click (function(e){
		location.href = "/productList";
	});

	$('.shadow').mouseover (function(e){
		$(this).css('background-color', "#fff");
	});

	$('.shadow').mouseout (function(e){
		$(this).css('background-color', "#1E90FF");
	});
	


})