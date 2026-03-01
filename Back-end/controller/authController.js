const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// JWT
const generateToken = (userId, role) => {
    return jwt.sign(
        {userId, role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || "7d"}
    );
};

// Register a new user (Sign Up)
const register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        // Find existing user
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message:"Email already in use"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user",
        });

        const token = generateToken(user.userId, user.role);
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// Login user (Sign In)
const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Find existing user
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.status(401).json({message:"Invalid email or password"});
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message:"Invalid email or password"});
        } 

        const token = generateToken(existingUser.userId, existingUser.role);
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                userId: existingUser.userId,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// Logout (Sign Out)
const logout = (req, res) => {
    res.status(200).json({ message:"Logged out successfully"});
};

module.exports = {register, login, logout};