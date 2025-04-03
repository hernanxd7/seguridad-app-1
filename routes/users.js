import express from 'express';
import { db } from '../config/firebase-config.js';
import { verifyToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', verifyToken, checkPermission('get_user'), async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];
        usersSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
router.delete('/:id', verifyToken, checkPermission('delete_user'), async (req, res) => {
    try {
        await db.collection('users').doc(req.params.id).delete();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user
router.put('/:id', verifyToken, checkPermission('update_user'), async (req, res) => {
    try {
        const { username, email } = req.body;
        await db.collection('users').doc(req.params.id).update({
            username,
            email,
            updatedAt: new Date()
        });
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;