import { NextFunction, Request, Response } from 'express';
import { appDataSource } from '../appDataSource';
import { Role } from '../models/role';
import { roleValidator } from '../lib/roleValidator';


appDataSource.initialize()
    .then(() => console.log('Data Source initialized'))
    .catch((error) => console.log('Error initializing Data Source:', error));

// Create a new role
export const createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { error } = roleValidator.validate(req.body);
        if (error) {
            res.status(400).json({
                message: 'Validation Error',
                details: error.details[0].message,
            });
            return;
        }
        const roleRepository = appDataSource.getRepository(Role);
        const existRole: Role | null = await roleRepository.findOne({
            where: { name: req.body.name },
        });
        if (existRole) {
            res.status(400).json({ message: 'Role already exists' });
            return;
        }
        const role = roleRepository.create(req.body);
        const savedRole = await roleRepository.save(role);
        res.status(201).json(savedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error creating role', error });
    }
};

// Get all roles
export const getRoles = async (_req: Request, res: Response): Promise<void> => {
    try {
        const roleRepository = appDataSource.getRepository(Role);
        const roles = await roleRepository.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving roles', error });
    }
};

// Get a single role by ID
export const getRoleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const roleRepository = appDataSource.getRepository(Role);
        const role = await roleRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!role) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving role', error });
    }
};

// Update a role by ID
export const updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { error } = roleValidator.validate(req.body);
        if (error) {
            res.status(400).json({
                message: 'Validation Error',
                details: error.details[0].message,
            });
            return;
        }
        const roleRepository = appDataSource.getRepository(Role);
        const role = await roleRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!role) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        roleRepository.merge(role, req.body);
        const updatedRole = await roleRepository.save(role);
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error });
    }
};

// Delete a role by ID
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const roleRepository = appDataSource.getRepository(Role);
        const result = await roleRepository.delete(req.params.id);
        if (result.affected === 0) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error });
    }
};