const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');
require('../models/user');
const User = mongoose.model('Users');



router.get('/', (req, res) => {
	res.render('home', {
		title : 'CHRN_Sales',
		heading : 'Manage Your Sales Effectively',
		style : 'home.css',
		// script : 'home.js'
	});
});


//user registration
router.get('/register', (req, res) => {

	res.render('register', {
		title : 'Register CHRN_Sales',
		style : 'register.css',
		// script : 'preloader.js'
	});
});

router.post('/register', (req, res) => {
	// res.render('register', {
	// 	title : 'Register CHRN_Sales',
	// 	style : 'register.css',
	// 	// script : 'preloader.js'
	// });

	let errors = [];

	if(!req.body.fname){
		errors.push({text: 'Please enter the Firstname'});
	}

	if(!req.body.password1){
		errors.push({text: 'Please enter the Password'});
	}else if(req.body.password1 != req.body.password2){
		errors.push({text: 'Password do not match'});
	}

	if(!req.body.email){
		errors.push({text: 'Please enter the Email'});
	}

	if (errors.length > 0) {
		res.render('register', {
			title : 'Register CHRN_Sales',
			style : 'register.css',
			errors : errors,
			fname : req.body.fname,
			password1 : req.body.password1,
			email : req.body.email
		});
	}else{
		const newUser = {
			firstName: req.body.fname,
			lastName: req.body.lname,
			password: req.body.password1,
			gender: req.body.gender,
			email: req.body.email,
			telephone: req.body.telephone,
			pharmacy: req.body.pharmacy,
			passHint: req.body.passHint
		}

		new User(newUser).save().then(user =>{
			res.redirect('/login');
		})
	}

	console.log(req.body);
	console.log(errors);

});




router.get('/login', (req, res) => {
	res.render('login', {
		title : 'CHRN Login',
		style : 'login.css',
		// script : 'main.js'
	});
});

router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.find({email:email})
    .then(user => {
    	if (!user) {
    		res.render('login', {
    			title : 'CHRN Login',
				style : 'login.css',
				error : 'Invalid User'
    		});
    	}else{
					res.redirect('/dashboard');
    		// res.render('dashboard', {
    		// 	title : 'CHRN Login',
				// style : 'dashboard.css',
				// // success : 'success'
    		// });
    	}
    });

	// res.render('login', {
	// 	title : 'CHRN Login',
	// 	style : 'login.css',
	// 	// script : 'main.js'
	// });
});



router.get('/dashboard', (req, res) => {
	req.flash('success_msg','you are in the Dashboard');
	res.render('dashboard', {
		title : 'CHRN Dashboard',
		style : 'dashboard.css',
		script : 'dashboard.js'
	});
});


router.get('/addNewproduct', (req, res) => {
	res.send("helloo");
	// res.render('dashboard', {
	// 	title : 'CHRN Dashboard',
	// 	// style : 'login.css',
	// 	script : 'dashboard.js'
	// });
});


module.exports = router;
