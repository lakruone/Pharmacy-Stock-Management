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
		title : 'Add New Product | Lakru-creation',
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


module.exports = router;
