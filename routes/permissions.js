import express from 'express';
import { db } from '../config/firebase-config.js';
import { verifyToken, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// Add permission to role
router.post('/:roleName', verifyToken, checkPermission('add_permissions'), async (req, res) => {
    try {
        const { permission } = req.body;
        const roleRef = db.collection('roles').doc(req.params.roleName);
        const role = await roleRef.get();
        
        if (!role.exists) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const currentPermissions = role.data().permissions || [];
        await roleRef.update({
            permissions: [...currentPermissions, permission]
        });
        
        res.json({ message: 'Permission added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete permission from role
router.delete('/:roleName/:permission', verifyToken, checkPermission('delete_permissions'), async (req, res) => {
    try {
        const roleRef = db.collection('roles').doc(req.params.roleName);
        const role = await roleRef.get();
        
        if (!role.exists) {
            return res.status(404).json({ message: 'Role not found' });
        }

        const currentPermissions = role.data().permissions || [];
        await roleRef.update({
            permissions: currentPermissions.filter(p => p !== req.params.permission)
        });
        
        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;