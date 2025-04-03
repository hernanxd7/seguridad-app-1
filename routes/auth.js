import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase-config.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user from Firebase
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userDoc = snapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Get user role and permissions
        const roleDoc = await db.collection('roles').doc(user.role).get();
        const permissions = roleDoc.exists ? roleDoc.data().permissions : [];

        // Create token
        const token = jwt.sign(
            { 
                userId: user.id,
                username: user.username,
                role: user.role,
                permissions
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update last login
        await userDoc.ref.update({
            lastLogin: new Date()
        });

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;