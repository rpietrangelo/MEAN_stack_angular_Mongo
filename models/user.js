var mongoose = require('mongoose');
mongoose.promise = global.promise;
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let emailLengthChecker = (email) => {
    if(!email) return false;
    else{
        if(email.length < 5 || email.length > 30) return false;
        else {
            return true;
        }
    }
};

let emailValidChecker = (email) => {
    if(!email) return false;
    else{
            const regExp = new 
            RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            return regExp.test(email);
        }
};

let usernameLengthChecker = (username) => {
    if(!username) return false;
    else{
        if(username.length < 3 || username.length > 15) return false;
        else {
            return true;
        }
    }
};

let usernameValidChecker = (username) => {
    if(!username) return false;
    else{
            const regExp = new 
            RegExp(/^[a-zA-Z0-9]+$/);
            return regExp.test(username);
        }
};

let passwordLengthChecker = (password) => {
    if(!password) return false;
    else{
        if(password.length < 8 || password.length > 35) return false;
        else {
            return true;
        }
    }
};

let passwordValidChecker = (password) => {
    if(!password) return false;
    else{
            const regExp = new 
            RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
            return regExp.test(password);
        }
};

const emailValidators = [
    {
        validator: emailLengthChecker, 
        message: 'E-mail must be at least 5 characters but no more than 30!'
    },
    {
        validator: emailValidChecker, 
        message: 'Must be a valid e-mail!'
    }
];

const usernameValidators = [
    {
        validator: usernameLengthChecker, 
        message: 'Username must be at least 3 characters but no more than 15!'
    },
    {
        validator: usernameValidChecker, 
        message: 'Username must not contain special characters!'
    }
];

const passwordValidators = [
    {
        validator: passwordLengthChecker, 
        message: 'Password must be at least 8 characters but no more than 30!'
    },
    {
        validator: passwordValidChecker, 
        message: 'Password must contain at least one Uppercase letter, lowercase letter, special character, and number!'
    }
];

const userSchema = new Schema({
    email: { type:String, required:true, unique:true, lowercase:true, validate: emailValidators },
    username: { type:String, required:true, unique:true, lowercase:true, validate: usernameValidators },
    password: { type:String, required:true, validate: passwordValidators }
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password'))
    return next();

    bcrypt.hash(this.password, null,null, (err, hash) => {
        if(err) return next(rerr);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);