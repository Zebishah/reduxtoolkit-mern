import mongoose from 'mongoose';
const Schema = mongoose.Schema;
let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    buyProducts: [{
        type: String,
        // type: mongoose.Types.ObjectId,
        // ref: "Product",
    },]
})
export default mongoose.model('User', userSchema);