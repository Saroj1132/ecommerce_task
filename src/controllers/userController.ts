import { Request, Response } from 'express';
import { User } from '../models/user';
import { appDataSource } from '../appDataSource';

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const userRepository = appDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { id: userId },
        select: ['id', 'username', 'email', 'role_id', 'created_at', 'updated_at'],
        relations: ['role_id'] 
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user profile', error });
  }
};
