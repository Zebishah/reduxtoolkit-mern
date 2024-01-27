import mongoose from 'mongoose';
const Schema = mongoose.Schema;
let bookedProduct_Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    pic: {
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

    buyer: {
        type: String,

    },



});
export default mongoose.model('BookProduct', bookedProduct_Schema);