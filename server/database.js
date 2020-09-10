import mongoose from 'mongoose'

const DB_URI = 'mongodb://localhost:27017/wattmatrix';

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

// TODO: This should probably store some game info at some point?
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

export default User
