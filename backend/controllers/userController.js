const User = require('../models/user');
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Create a new user in the database
        const newUser = new User({ username, email, password, role: 'customer'});
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    try {
        console.log(req);
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        const role = user.role;

        console.log(role);
        const check = (await user.comparePassword(password));
        console.log(check);
        // Check if the user exists and the password is correct
        if (user && check) {
            // Generate a JWT token
            const token = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });

            res.status(200).json({ token, role });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to authenticate user' });
    }
};

module.exports = { register, login };

