const express = require("express");
const router = express.Router();
const User = require('../models/user_query');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');




////////////////////////////////////////
var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "lakruone@gmail.com",
        pass: "tcoumguxdkxmmaba"
    }
});

/////////////////////////////////////////////


router.get('/', (req, res) => {
	res.render('home', {
		title : 'Lakru-creations | Home',
		style : 'home.css',
	});
});

router.get('/activate', (req, res) => {
	res.render('activate_account', {
		title : 'Activate account | Register',
		style : 'activate_account.css',
	});
});

router.post('/activate_account', (req, res) => {
	const username = req.body.username;
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const email =req.body.email;
	var password = req.body.password;
	const phone =req.body.phone;
	console.log(username);

	userData = {
		username:username,
		firstname:firstname,
		lastname:lastname,
		email:email,
		password:password,
		phone:phone
	}

	//check email exists   -----tcoumguxdkxmmaba  <----app password
	User.checkEmail(email, (err, result) =>{
		if(err) {
			console.log(err);
		}
		if(result ==true){
			res.json({message :false});
			console.log("email already registered");

		}else {
			res.json({message :true});

			///////////////generate token//////////////
			jwt.sign({userData},'LakruSecret',{ expiresIn: '24h' }, (err,token)=>{
					if(err){
						console.log(err);
					}
					 if(token){
						 // console.log(token);
						 console.log('sending email to %s',email);
						 /////////////////////////send email////////////////////////////////////////
						 var mailOptions = {
								 from: 'lakruone@gmail.com',
								 to:email,
								 subject: 'Activate your account | lakru-creations ',
								 //text: req.body.content,
								 html: '<h3>Activate your lakru-creations account </h3><p>Click the following link to activate the account </p>	<p>http://localhost:5600/activate/'+token+'</p>	<p>username :'+username+'</p>	<p>password :'+password+'</p> <hr>Thank you,<p>Best Regards</p><p>lakru-creations</p>'

						 };

							 smtpTransport.sendMail(mailOptions, (error, info) => {
								 if (error) {
										 return console.log('Error while sending mail: ' + error);
								 } else {
										 console.log('Message sent: %s', info.messageId);
								 }
								 smtpTransport.close();
							 });
						 ///////////////////////////////////////////////////////////////
					 }
				 });

		}
	});

});




//Error page
router.get('/forbidden/:error_message', (req, res) => {
	console.log(req.params.error_message);
	const message = req.params.error_message;

	res.render('forbidden', {
		title : 'Lakru-creations | Forbidden',
		style : 'forbidden.css',
		message : message
	});
});




// Route for emailed links
router.get('/activate/:token', (req, res) => {

	jwt.verify(req.params.token, 'LakruSecret', (err, decodeData) =>{
    if(err){
			console.log(err);
			res.redirect('/forbidden/The link is expired and no longer available. Please sign up again');
			return;
    }else{
			console.log(decodeData);
			const username = decodeData.userData.username;
			const firstname = decodeData.userData.firstname;
			const lastname = decodeData.userData.lastname;
			const email = decodeData.userData.email;
			var password = decodeData.userData.password;
			const phone = decodeData.userData.phone;

			////////////////////check email exists///////////////////////////
			User.checkEmail(email, (err, result) =>{
				if(err) {
					console.log(err);
				}
				if(result ==true){
					console.log("Regitered email,account already activated, go to dashboard");

					res.render('dashboard', {
						title : 'lakru-creations | Dashboard',
						style : 'dashboard.css',
						username : username,
						email:email
					});
					return;

				}else {
					///////////////////////save user///////////////////////////////
					bcrypt.genSalt(10,(err,salt) =>{
						bcrypt.hash(password,salt, (err,hash) =>{
							if(err) throw err;
						 password = hash;

						 //save data in to the database
						 User.saveUser(username,firstname,lastname,email,password,phone, (err, result)=>{
							 if(err){
								 console.log(err);
							 }
							 else{
									console.log("user registered succesfully");

									res.render('dashboard', {
										title : 'lakru-creations | Dashboard',
										style : 'dashboard.css',
										username : username,
										email:email
									});
									return;
							 }
						 });

						});
					});
					/////////////////////////////////////////////////////
				}
			});
		///////////////////////////////////////////////

		}
	});
});

//dashboard
// router.get('/dashboard', (req, res) => {
// console.log(req.body);
// 	res.render('dashboard', {
// 		title : 'Lakru-creations | Dashboard',
// 		style : 'dashboard.css',
// 		username : "User name here"
// 	});
// });

//user login
router.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);

 User.findUser(username,password, (err,userData) =>{
   if(err){
   console.log(err);
    }

   if(userData ==null){
		 console.log("No user found");
     return res.json({ data : "no_user"});

   }
   if(userData.data){
		 console.log("password do not match");
		 return res.json({ data : "false_pass"});;
   }

   else{
		 console.log(userData);
		 return res.json({ data : "success", userData});; //last_edit here

		 // res.render('dashboard', {
			//  title : 'lakru-creations | Dashboard',
			//  style : 'dashboard.css',
			//  username : userData.username,
			//  email:userData.email
		 // });
		 // return;

    	}
 });
});


//registering the user ----(user/register)
router.post("/register", (req,res) => {
		const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email =req.body.email;
    var password = req.body.password;
    const phone =req.body.phone;
		console.log("register");
		return res.json({data:"message recieved"})
      User.checkEmail(email, (err, result) =>{
        if(err) {
          console.log(err);
        }
        if(result ==true){
          // res.status(403).json({message :"Email already registered"});
					console.log("email already registered");
					return;
        }else{
            bcrypt.genSalt(10,(err,salt) =>{
              bcrypt.hash(password,salt, (err,hash) =>{
                if(err) throw err;
               password = hash;

               //save data in to the database
               User.saveUser(username,firstname,lastname,email,password,phone, (err, result)=>{
                 if(err){
                   console.log(err);
                 }
                 else{
                    // res.status(200).json({message :"user registered successfully"});
										console.log("user registered succesfully");
										return;
                 }
               });

              });
            });

          }
      });

  });


//user registration
// router.get('/register', (req, res) => {
//
// 	res.render('register', {
// 		title : 'Register CHRN_Sales',
// 		style : 'register.css',
// 		// script : 'preloader.js'
// 	});
// });

// router.post('/register', (req, res) => {
// 	// res.render('register', {
// 	// 	title : 'Register CHRN_Sales',
// 	// 	style : 'register.css',
// 	// 	// script : 'preloader.js'
// 	// });
//
// 	let errors = [];
//
// 	if(!req.body.fname){
// 		errors.push({text: 'Please enter the Firstname'});
// 	}
//
// 	if(!req.body.password1){
// 		errors.push({text: 'Please enter the Password'});
// 	}else if(req.body.password1 != req.body.password2){
// 		errors.push({text: 'Password do not match'});
// 	}
//
// 	if(!req.body.email){
// 		errors.push({text: 'Please enter the Email'});
// 	}
//
// 	if (errors.length > 0) {
// 		res.render('register', {
// 			title : 'Register CHRN_Sales',
// 			style : 'register.css',
// 			errors : errors,
// 			fname : req.body.fname,
// 			password1 : req.body.password1,
// 			email : req.body.email
// 		});
// 	}else{
// 		const newUser = {
// 			firstName: req.body.fname,
// 			lastName: req.body.lname,
// 			password: req.body.password1,
// 			gender: req.body.gender,
// 			email: req.body.email,
// 			telephone: req.body.telephone,
// 			pharmacy: req.body.pharmacy,
// 			passHint: req.body.passHint
// 		}
//
// 		new User(newUser).save().then(user =>{
// 			res.redirect('/login');
// 		})
// 	}
//
// 	console.log(req.body);
// 	console.log(errors);
//
// });
//
//
//
//
// router.get('/login', (req, res) => {
// 	res.render('login', {
// 		title : 'CHRN Login',
// 		style : 'login.css',
// 		// script : 'main.js'
// 	});
// });

// router.post('/login', (req, res) => {
// 	const email = req.body.email;
// 	const password = req.body.password;
//
// 	User.find({email:email})
//     .then(user => {
//     	if (!user) {
//     		res.render('login', {
//     			title : 'CHRN Login',
// 				style : 'login.css',
// 				error : 'Invalid User'
//     		});
//     	}else{
// 					res.redirect('/dashboard');
//     		// res.render('dashboard', {
//     		// 	title : 'CHRN Login',
// 				// style : 'dashboard.css',
// 				// // success : 'success'
//     		// });
//     	}
//     });
//
// 	// res.render('login', {
// 	// 	title : 'CHRN Login',
// 	// 	style : 'login.css',
// 	// 	// script : 'main.js'
// 	// });
// });



// router.get('/dashboard', (req, res) => {
// 	req.flash('success_msg','you are in the Dashboard');
// 	res.render('dashboard', {
// 		title : 'CHRN Dashboard',
// 		style : 'dashboard.css',
// 		script : 'dashboard.js'
// 	});
// });
//
//
// router.get('/addNewproduct', (req, res) => {
// 	res.send("helloo");
// 	// res.render('dashboard', {
// 	// 	title : 'CHRN Dashboard',
// 	// 	// style : 'login.css',
// 	// 	script : 'dashboard.js'
// 	// });
// });


module.exports = router;
