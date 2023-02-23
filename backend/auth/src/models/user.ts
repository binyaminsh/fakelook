import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExp: {
        type: Date,
        required: false
    }
},{versionKey: false})
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

const User = mongoose.model('User', userSchema);
export { User} ;