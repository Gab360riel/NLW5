import {Request, Response } from 'express'
import { MessageService } from '../services/MessageService';


class MessagesController {
    async index(req: Request, res: Response) {
        const { id } = req.params;

        const messageService = new MessageService();

        const message = await messageService.index(id);

        return res.json(message);
    }

    async store(req: Request, res: Response) {
        const { admin_id, text, user_id } = req.body;

        const messageService = new MessageService();

        
        const message = await messageService.store({
            admin_id,
            text,
            user_id,
        });

        return res.json(message);
        
    }

}

export { MessagesController };