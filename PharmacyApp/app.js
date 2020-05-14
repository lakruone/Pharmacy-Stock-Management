const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const hbs_helpers = require('handlebars-helpers');
var math = hbs_helpers.math();


const app = express();

const User = require('./routes/User');
const Functions = require('./routes/Functions');




//public folder for css , assets etc
app.use(express.static('public'));

//passport config
require('./config/passport')(passport);

//handlebars middleware
app.engine('handlebars',exphbs({defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//express session midleware
app.use(session({
  secret: 'lkSecret',
  resave: true,
  saveUninitialized: true
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash midleware
app.use(flash());

//setting a global variable midleware
app.use(function(req,res,next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
	next();
});



//routes
app.use("/",User);
app.use("/",Functions);






const port = process.env.PORT ||5600;

app.listen(port, () =>{
	console.log(`server listening on port ${port}`);
});
