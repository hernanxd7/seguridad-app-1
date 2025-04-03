import express from 'express';
import { db } from '../config/firebase-config.js';
import { verifyToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Update role
router.put('/:userId/role', verifyToken, checkPermission('update_role'), async (req, res) => {
    try {
        const { role } = req.body;
        await db.collection('users').doc(req.params.userId).update({ role });
        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new role
router.post('/', verifyToken, checkPermission('add_role'), async (req, res) => {
    try {
        const { roleName, permissions } = req.body;
        await db.collection('roles').doc(roleName).set({ permissions });
        res.json({ message: 'Role added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete role
router.delete('/:roleName', verifyToken, checkPermission('delete_role'), async (req, res) => {
    try {
        await db.collection('roles').doc(req.params.roleName).delete();
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;