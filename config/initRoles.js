import { db } from './firebase-config.js';

const initializeRoles = async () => {
  try {
    // Define roles and their permissions
    const roles = {
      master: {
        permissions: [
          'add_user',
          'delete_user',
          'update_user',
          'get_user',
          'add_permissions',
          'delete_permissions',
          'update_permissions'
        ]
      },
      common_user: {
        permissions: ['get_user']
      }
    };

    // Add roles to Firestore
    for (const [roleName, roleData] of Object.entries(roles)) {
      await db.collection('roles').doc(roleName).set(roleData);
    }

    console.log('Roles initialized successfully');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};

// Run the initialization
initializeRoles();