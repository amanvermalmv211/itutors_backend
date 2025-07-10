import mongoose from 'mongoose';
const { Schema } = mongoose;

const StudentSchema = new Schema({
    aadhar: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactnum: {
        type: Number,
        required: true
    },
    othercnum: {
        type: Number,
        default: null
    },
    feePrice: {
        type: Number,
        default: 1000,
        required: true
    },
    feePaid: {
        type: Number,
        default: 0,
        required: true
    },
    feePending: {
        type: Boolean,
        default: true
    },
    subscriptionDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Student = mongoose.model('Student', StudentSchema);
Student.createIndexes();

export default Student;