const LocalStrategy  = require('passport-local').Strategy;
const User = require('../models/user_query');


module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {

    console.log("inside passport");

    User.findUser(username,password, (err,userData) =>{
      if(err) throw err;

      if (userData) {
        console.log(userData);
        return done(null, userData);
      }
    });
  //////////////////////////////////////////////////


    passport.serializeUser(function(user, done) {
      done(null, user.user_id);
    });

    passport.deserializeUser(function(id, done) {
      User.findUserById(id, (err, user)=>{
        done(err, user);
      });
    });

}))
}
