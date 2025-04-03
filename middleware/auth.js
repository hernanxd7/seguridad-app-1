import jwt from 'jsonwebtoken';
import { db } from '../config/firebase-config.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userPermissions = req.user.permissions;
            
            if (!userPermissions.includes(requiredPermission)) {
                return res.status(403).json({ 
                    message: 'Permission denied' 
                });
            }
            
            next();
        } catch (error) {
            return res.status(500).json({ 
                message: 'Error checking permissions' 
            });
        }
    };
};