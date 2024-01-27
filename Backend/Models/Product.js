import mongoose from 'mongoose';
const Schema = mongoose.Schema;
let productsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
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
    sells: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
    admins: [{
        type: String,

    }],
    buyers: [{
        type: String,

    }],
    available: {
        type: Boolean,

    }


});
export default mongoose.model('Product', productsSchema);