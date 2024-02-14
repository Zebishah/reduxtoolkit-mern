import mongoose from 'mongoose';
const Schema = mongoose.Schema;
let cartProduct_Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "User",

    },
    buyDate: {
        type: Date,
        default: Date.now, // Set the default value to the current date and time
    },



});
export default mongoose.model('CartProduct', cartProduct_Schema);