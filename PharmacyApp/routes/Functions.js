const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {ensureAuthenticated} = require('../config/auth');
const Function = require('../models/function_query');



//set storage engine
const storage = multer.diskStorage({
	destination:"./public/uploads",
	filename: function(req,file,cb){
		cb(null,file.fieldname+'_'+Date.now()+path.extname(file.originalname));  //+path.extname(file.originalname)
	}
});

//init uploads
const upload = multer({
	storage:storage,
	limits: {fileSize:10000000}
}).single('imgFile');


//new product page
router.get('/add_new_product',ensureAuthenticated, (req, res) => {
	res.render('add_new_product', {
		title : 'Add New Product | '+req.user.username,
		style : 'add_new_product.css',
	});
});


//add new product
router.post('/add_new',ensureAuthenticated, (req, res) => {

	upload(req,res, (err)=>{

		if (err) {
			console.log(err);
		}else{
			const product_name = req.body.product_name;
			const quantity = req.body.quantity || 0;
			const price = req.body.price || 0;
			const user_id = req.user.user_id;
			var product_image =  null;

			if (req.file != undefined) {
				console.log("image files available");
				product_image = req.file.filename;
			}

			Function.findProductByName(product_name,user_id, (err,cb1)=>{
				if (err) {
					console.log(err);
				}
				if (cb1==true) {
					console.log("product already in the list");
					res.render('add_new_product', {
						title : 'Add New Product | '+req.user.username,
						style : 'add_new_product.css',
						product_name : product_name,
						error_msg: 'Product already in the list..!'
					});
				}else{

					Function.saveProduct(user_id,product_name,quantity,price,product_image, (err, cb2)=>{
						if(err){
							console.log(err);
						}else{
							console.log("product added successfully");
							res.render('add_new_product', {
								title : 'Add New Product | '+req.user.username,
								style : 'add_new_product.css',
								success_msg:'Product Added Succesfully..!'
							});
						}
					});

				}

			});
		}
	});

});


//add sale
router.get('/add_sale',ensureAuthenticated, (req, res) => {
	Function.getProductList(req.user.user_id, (err,cb)=>{
		if (err) {
			console.log(err);
		}else {
			const product_list = cb;
			// console.log(product_list);
			if (product_list[0]==null) {
				// console.log(product_list[0].product_id);
				res.render('add_sale', {
					title : 'Add Sale | '+req.user.username,
					style : 'add_sale.css',
					p_list : product_list,
					error_msg : 'No products Available. You need atleast one product to add a sale.'
				});

			}else {

				product_list.unshift({prodcut_id:0, product_name:"select product"});

				// console.log(product_list);
				res.render('add_sale', {
					title : 'Add Sale | '+req.user.username,
					style : 'add_sale.css',
					p_list : product_list
				});
			}


		}
	})

});

router.post('/add_sale',ensureAuthenticated, (req, res) => {

	const product_ids = req.body.product_id;
	const quantity_list = req.body.quantity;
	const user_id = req.user.user_id;
	const arrayLength = req.body.product_id.length;

	Function.insertBill(user_id, (err, cb)=>{
		if (err) {
			console.log(err);
		}else {
			const bill_id =cb.insertId;
			// console.log(cb.insertId);

			for (var i = 0; i < arrayLength; i++) {
				var quantity = quantity_list[i];
				var product_id = product_ids[i];

				saveAndUpdateSale(product_id,quantity,bill_id);

			}//loop finished

			Function.getProductList(user_id, (err1,cb1)=>{
				if (err1) {
					console.log(err1);
				}else {
					const product_list = cb1;
					product_list.unshift({prodcut_id:0, product_name:"select product"});

					// console.log(product_list);
					res.render('add_sale', {
						title : 'Add Sale | '+req.user.username,
						style : 'add_sale.css',
						p_list : product_list,
						success_msg : 'Sale added successfully..!'
					});


				}
			});

		}
	});


});

//this function for above route
function saveAndUpdateSale(product_id,quantity,bill_id){

	Function.reduceStockQuantity(product_id,quantity, (err1,cb1)=>{
		if (err1) {
			console.log(err1);
		}else {
			// console.log(cb1);
			var sale_product = cb1.product_name;
			var	unit_price = cb1.price;

			Function.addSale(bill_id,sale_product,quantity,unit_price, (err2,cb2)=>{
				if (err2) {
					console.log(err2);
				}else {
					console.log(cb2);
				}
			});
		}
	});

}

//preview_image
// router.post('/preview_image', (req, res) => {
// 	console.log(req.body.product_id);
// 	const product_id = req.body.product_id;
// 	Function.findProductImage(product_id, (err,cb)=>{
// 		if (err) {
// 			console.log(err);
// 		}else {
// 			console.log(cb);
// 			const image_name = cb;
// 			return res.json({imgName:image_name});
// 		}
// 	});
//
// });

//price_list
router.post('/price_list', (req, res) => {
	// console.log(req.body.product_id);
	const product_id = req.body.product_id;
	Function.getPriceAndName(product_id, (err,cb)=>{
		if (err) {
			console.log(err);
		}else {
			// console.log(cb);

			return res.json({product_name:cb.product_name ,price:cb.price});
		}
	});

});


//view sales
router.get('/view_sale',ensureAuthenticated, (req, res) => {
	const date = new Date().toISOString().substr(0,10);
	// const date0 = '2020-04-28 '+'00:00:00';
	// const date1 = '2020-04-28 '+'23:59:59';
	const date0 = date+' 00:00:00';
	const date1 = date+' 23:59:59';

	const user_id = req.user.user_id;
	console.log(user_id);
	console.log(date);



	Function.getSalesByDate(user_id,date0,date1, (err,result)=>{
		if (err) {
			console.log(err);
		}else {
			console.log(result);
			var total =0;

			if (result==null) {
				res.render('view_sales', {
					title : 'View Sales',
					style : 'view_sales.css',
					date : date,
					sales : result,
					total : total,
					error_msg : 'Oops.! You have no sales today..!'
				});

			}else {
				for (var i = 0; i < result.length; i++) {
					const price = result[i].unit_price* result[i].sale_quantity;
					total = total +price;
				}
				res.render('view_sales', {
					title : 'View Sales',
					style : 'view_sales.css',
					date : date,
					sales : result,
					total : total
				});

			}
		}
	});
});

//daily_sales
router.post('/dailySales', (req, res) => {
	// console.log("hello");
	const user_id = req.body.user_id;
	const date = req.body.date;
	const date0 = date+' 00:00:00';
	const date1 = date+' 23:59:59';
	// const date0 = '2020-04-28 '+'00:00:00';
	// const date1 = '2020-04-28 '+'23:59:59';
	console.log(date0);

	/////////////////////////////

	Function.getSalesByDate(user_id,date0,date1, (err,result)=>{
		if (err) {
			console.log(err);
		}else {
			console.log(result);

			return res.json({result:result});

		}
	});
	//////////////////////////////////////////////////////

});

// monthlySales
router.post('/monthlySales', (req, res) => {
	// console.log("hello");
	const user_id = req.body.user_id;
	const month = req.body.month;
	const year = req.body.year;

	const date0 = year+'-'+month+'-01 00:00:00';
	const date1 = year+'-'+month+'-31 23:59:59';

console.log(user_id+"user id ");
	Function.getSalesByMonth(user_id,date0,date1, (err,result)=>{
		if (err) {
			console.log(err);
		}else {
			// console.log(result);
			return res.json({result:result});
			
		}
	});


});



module.exports = router;
