const express = require("express");
const router = express.Router();
const User = require('../models/user_query');


router.get('/', (req, res) => {
	res.render('home', {
		title : 'Lakru-creations | Home',
		style : 'home.css',
	});
});



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
		 return;
     // return res.status(404).json({ data : "No user found"});

   }
   if(userData.data){
		 console.log("password do not match");
		 return;
    // return res.status(400).json({data :"password did not match"});
   }

   else{
		 console.log("success");
		 return;
       //console.log(userData.userType);

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
    const password2 = req.body.password2;
    const phone =req.body.phone;

    if(password.length < 8){
      console.log("password do not match");
      return res.status(402).json({message:"password must more than 8 charactors"});
    }
    if(password != confirmPassword){
      console.log("password do not match");
      return res.status(400).json({message:"password do not match"});
    }
    else{
      User.checkEmail(email, (err, result) =>{
        if(err) {
          console.log(err);
        }
        if(result ==true){
          res.status(403).json({message :"Email already registered"});
        }else{
            bcrypt.genSalt(10,(err,salt) =>{
              bcrypt.hash(password,salt, (err,hash) =>{
                if(err) throw err;
               password = hash;

               //save data in to the database
               User.saveUser(firstName,lastName,email,password,address,mobileNo, (err, result)=>{
                 if(err){
                   console.log(err);
                 }
                 else{
                    res.status(200).json({message :"user registered successfully"});
                 }
               });
              });
            });

          }
      });
    }
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
