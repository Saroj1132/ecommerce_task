import { Router } from 'express';
import {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole
} from '../controllers/roleController';

const router = Router();

router.post('/role/createRole', createRole);
router.get('/role/getRoles', getRoles);
router.get('/role/getSingleRole/:id', getRoleById);
router.put('/role/updateRole/:id', updateRole);
router.delete('/role/deleteRole/:id', deleteRole);

export default router;
