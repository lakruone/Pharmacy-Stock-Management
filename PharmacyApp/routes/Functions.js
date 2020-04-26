const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {ensureAuthenticated} = require('../config/auth');
const User = require('../models/function_query');



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

			User.findProductByName(product_name,user_id, (err,cb1)=>{
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

					User.saveProduct(user_id,product_name,quantity,price,product_image, (err, cb2)=>{
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
	User.getProductList(req.user.user_id, (err,cb)=>{
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
	console.log(req.body.quantity);
});

//preview_image
// router.post('/preview_image', (req, res) => {
// 	console.log(req.body.product_id);
// 	const product_id = req.body.product_id;
// 	User.findProductImage(product_id, (err,cb)=>{
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
	console.log(req.body.product_id);
	const product_id = req.body.product_id;
	User.getPriceAndName(product_id, (err,cb)=>{
		if (err) {
			console.log(err);
		}else {
			// console.log(cb);

			return res.json({product_name:cb.product_name ,price:cb.price});
		}
	});

});



module.exports = router;
