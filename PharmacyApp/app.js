const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

const User = require('./routes/User');

// Map global promise - get rid of warning
// mongoose.Promise = global.Promise;

// Connect to mongoose
// mongoose.connect('mongodb://localhost/CHRN_Sales', {
//   useNewUrlParser: true
// })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err));





//public folder for css , assets etc
app.use(express.static('public'));

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

//flash midleware
app.use(flash());

//setting a global variable midleware
app.use(function(req,res,next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});



//routes
app.use("/",User);







const port = process.env.PORT ||5600;

app.listen(port, () =>{
	console.log(`server listening on port ${port}`);
});
