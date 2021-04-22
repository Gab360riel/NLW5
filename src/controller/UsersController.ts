import {Request, Response}  from 'express';
import { UserService } from '../services/UserService';


class UserController {
    async store(req: Request, res: Response){
        const { email } = req.body;

        const usersService = new UserService();

        const user = await usersService.store(email);

        return res.json(user);
    }
}

export { UserController }