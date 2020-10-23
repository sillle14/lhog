import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

export default User