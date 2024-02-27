const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    refreshToken: { type: String, required: false },
    passToken: { type: String, required: false, trim: true },
    passExpiry: { type: Date },
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};


module.exports = mongoose.model('User', userSchema);

