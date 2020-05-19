const express = require("express");
const router = express.Router();
const User = require('../models/user_query');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const {ensureAuthenticated} = require('../config/auth');






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
  const host = req.get('host');
  const protocol = req.protocol;

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
      console.log("email already registered");

			return res.json({message :1});

		}else {

      ////////////check username exists//////////////////////////
      User.checkUsername(username, (err1, result1) =>{
        if(err) {
          console.log(err1);
        }
        if(result1 ==true){
          console.log("username already exists");

          return res.json({message :2});

        }else {
         res.json({message :0});  

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
                     html: '<h3>Activate your lakru-creations account </h3><p>Click the following link to activate the account </p>	<p>'+protocol+'://'+host+'/activate/'+token+'</p>	<p>username :'+username+'</p>	<p>password :'+password+'</p> <hr>Thank you,<p>Best Regards</p><p>lakru-creations</p>'

                 };

                   smtpTransport.sendMail(mailOptions, (error, info) => {
                     if (error) {
                         return console.log('Error while sending mail: ' + error);
                     } else {
                         console.log('Message sent: %s', info.messageId);
                     }
                     smtpTransport.close();
                   });
               }
             });

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
router.get('/activate/:token', (req, res,next) => {

	jwt.verify(req.params.token, 'LakruSecret', (err, decodeData) =>{
    if(err){
			console.log(err);
			res.redirect('/forbidden/The link is expired and no longer available. Please sign up again');
			return;
    }else{
			// console.log(decodeData);
			const username = decodeData.userData.username;
			const firstname = decodeData.userData.firstname;
			const lastname = decodeData.userData.lastname;
			const email = decodeData.userData.email;
			var password = decodeData.userData.password;
			const phone = decodeData.userData.phone;

      req.body.username = username;
      req.body.password = password;

			////////////////////check email exists///////////////////////////
			User.checkEmail(email, (err, result) =>{
				if(err) {
					console.log(err);
				}
				if(result ==true){
					console.log("Regitered email,account already activated, go to dashboard");

          passport.authenticate('local', {
            successRedirect:'/dashboard'
            // failureRedirect: '/users/login',
            // failureFlash: true
           })(req, res, next);
          ////////////////////////////////

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

                  ////////////////////////////////////
                  passport.authenticate('local', {
                    successRedirect:'/dashboard'
                    // failureRedirect: '/users/login',
                    // failureFlash: true
                   })(req, res, next);
                   /////////////////////////////////////
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
router.get('/dashboard', ensureAuthenticated, (req, res) => {
console.log("dashboard");
// console.log(req.user);

	res.render('dashboard', {
		title : 'Lakru-creations | Dashboard',
		style : 'dashboard.css',
	});
});




//user login
router.post("/login", (req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;
  // console.log(username);

 User.findUser(username,password, (err,userData) =>{
   if(err){
   console.log(err);
    }

   if(userData ==null){
		 console.log("No user found");
     // return res.json({ data : "no_user"});
     return res.render('home', {
       title : 'Lakru-creations | Home',
   		 style : 'home.css',
       username: username,
       password: password,
       error1:"Invalid username"
     });

   }
   if(userData.data){
		 console.log("password do not match");
		 // return res.json({ data : "false_pass"});;
     return res.render('home', {
       title : 'Lakru-creations | Home',
        style : 'home.css',
       username: username,
       password: password,
       error2:"Incorect password"
     });
   }

   else{
		 // console.log(userData);

     passport.authenticate('local', {
       successRedirect:'/dashboard'
       // failureRedirect: '/users/login',
       // failureFlash: true
      })(req, res, next);

    	}
 });
});


// Logout User
router.get('/logout', (req, res) => {
  console.log(req.user);
  console.log("before logout");
  req.logout();
  console.log(req.user);
  // req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});



module.exports = router;
