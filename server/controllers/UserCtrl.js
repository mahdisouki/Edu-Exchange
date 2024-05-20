const users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
    register: async (req, res) => {
        try {
            const { nom, prenom, email, password } = req.body;
            const user = await users.findOne({ email });
            if (user)
                return res.status(400).json({ msg: 'The email already exists.' });

            if (password.length < 6)
                return res.status(400).json({ msg: 'Password is at least 6 characters long.' });

            // Password encryption
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new users({
                nom, prenom, email, password: passwordHash
            });
            await newUser.save();

            // Create JSON Web Token for authentication
            const accesstoken = createAccessToken({ id: newUser._id });

            res.json({ accesstoken });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await users.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'User does not exist.' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' });

            // If login is successful, create access token and refresh token
            const accesstoken = createAccessToken({ id: user._id });

            res.json({ accesstoken });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await users.findById(req.user.id).select('-password');
            if (!user) return res.status(400).json({ msg: 'User does not exist.' });
            res.json(user);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const allUsers = await users.find({});
            res.status(200).send({ response: allUsers });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { nom, prenom, email, password, role } = req.body;

            // Find the user by ID to get the current user data
            const currentUser = await users.findById(req.params.id);

            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // Construct the update object
            const updateFields = {};

            if (nom && nom !== currentUser.nom) {
                updateFields.nom = nom;
            }

            if (prenom && prenom !== currentUser.prenom) {
                updateFields.prenom = prenom;
            }

            if (email && email !== currentUser.email) {
                updateFields.email = email;
            }

            if (password) {
                const passwordHash = await bcrypt.hash(password, 10);
                updateFields.password = passwordHash;
            }

            if (role && role !== currentUser.role) {
                updateFields.role = role;
            }

            // Perform the update with the modified fields
            await users.findOneAndUpdate({ _id: req.params.id }, updateFields);
            res.json({ msg: "Updated user" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    deleteUser: async (req, res) => {
        try {
            await users.findByIdAndDelete(req.params.id);
            res.json({ msg: "Deleted user" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' });
}

module.exports = userCtrl;
