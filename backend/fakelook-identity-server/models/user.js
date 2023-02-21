const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    workplace: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
}, { versionKey: false})
userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
userSchema.virtual('id').set(function(v){
    const _id = v ;
     this.set({_id})
});


module.exports = mongoose.model('User', userSchema)