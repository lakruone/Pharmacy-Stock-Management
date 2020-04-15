const mongoose =require('mongoose');
const Schema = mongoose.Schema;
 
//create schema
const UserSchema = new Schema({
	firstName : {
		type: String,
		required: true
	},
	lastName : {
		type: String
	},
	gender : {
		type: String
	},
	password : {
		type: String,
		required:true
	},
	email : {
		type: String,
		required: true
	},
	telephone : {
		type: Number
	},
	pharmacy : {
		type: String
	},
	passHint : {
		type: String
	},
	date : {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Users', UserSchema);