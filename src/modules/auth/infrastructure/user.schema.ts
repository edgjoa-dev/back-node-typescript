import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    roles: {
        type: [String],
        default: ['CLIENT'],
        enum: ['ADMIN', 'CLIENT', 'VENDEDOR'],
    },
    status: {
        type: Boolean,
        default: true,
    },
});

export const UserModel = mongoose.model('User', UserSchema);
