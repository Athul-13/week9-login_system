const User = require('../models/User');
const {generateAccessToken, generateRefreshToken} = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');

// register user
exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: 'User already exists'})
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'user'
        });

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
};

// login user
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            profilePicture: user.profilePicture,
            email: user.email,
            role: user.role,
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: err.message});
    }
};

// logout user
exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.refreshToken = null;
        await user.save();
        res.json({message: 'logout successfull'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// get user by Id
exports.getUserById = async (req, res) => {
    try {
        const searchTerm = req.query.q;

        if (!searchTerm) {
            return res.status(400).json({message: 'Please provide a Search term'})
        }

        const user = await User.find({
            $or: [
                {name: {$regex: searchTerm, $options: 'i'}},
                {email: {$regex: searchTerm, $options: 'i'}}
            ]
        }).select('-password');
        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// update user profilePicture
exports.UpdatePicture = async (req, res) => {
    const {imageUrl} = req.body;
    try {
        
        const userId = req.user._id;
        
        if (!imageUrl) {
            return res.status(400).json({ message: 'No image URL provided' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: imageUrl },
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accessToken = generateAccessToken(updatedUser._id, updatedUser.role);
        const refreshToken = generateRefreshToken(updatedUser._id);

        updatedUser.refreshToken = refreshToken;
        await updatedUser.save();

        return res.status(200).json({
            message: 'Profile picture updated',
            profilePicture: imageUrl,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Update Profile Picture Error:', error);
        return res.status(500).json({ 
            message: 'Error updating profile picture',
            error: error.message 
        });
    }
}

// edit user
exports.editUser = async (req, res) => {
    try {
        const {name, email, role} = req.body;
        const userId = req.params.id 

        const userExists = await User.findOne({
            email,
            _id: {$ne: userId}
        });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {name, email},
            {new: true, select: '-password'}
        );

        if (!updatedUser) {
            return res.status(404).json({message: 'user not found'});
        }

        const accessToken = generateAccessToken(updatedUser._id, updatedUser.role);
        const refreshToken = generateRefreshToken(updatedUser._id);

        updatedUser.refreshToken = refreshToken;
        await updatedUser.save(); 

        res.status(200).json({...updatedUser.toObject(),
            accessToken, refreshToken});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return res.status(404).json({message: 'user not found'});
        }
        
        res.status(200).json({message: 'user deleted'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// refresh token
exports.refreshToken = async (req, res) => {
    try {
        const {refreshToken} = req.body;

        if(!refreshToken) {
            return res.status(401).json({message: 'token not provided'});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if(!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({message: 'invalid token'});
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({accessToken, refreshToken: newRefreshToken});
    } catch (err) {
        res.status(401).json({message: 'invalid token'});
    }
}


