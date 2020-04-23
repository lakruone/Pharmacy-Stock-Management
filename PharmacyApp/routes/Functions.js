const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');

// const User = require('../models/user_query');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');
// const passport = require('passport');

// const {ensureAuthenticated} = require('../config/auth');


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
router.get('/add_new_product', (req, res) => {
	res.render('add_new_product', {
		title : 'Add New Product | Lakru-creation',
		style : 'add_new_product.css',
	});
});


//add new product
router.post('/add_new', (req, res) => {

	upload(req,res, (err)=>{
		console.log(req.file);
		console.log(req.body);
		if (err) {
			console.log(err);
		}else{
			if (req.file == undefined) {
				console.log("No image files available");
			}else {
				console.log("Image uploaded succesfully");
			}
		}
	});
	// res.render('add_new_product', {
	// 	title : 'Add New Product | Lakru-creation',
	// 	style : 'add_new_product.css',
	// });
});


module.exports = router;
