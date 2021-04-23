import { getCustomRepository, Repository } from "typeorm";

import { Message } from '../entities/Message';
import { MessagesRepository } from "../repositories/MessagesRepository";

interface IMessageStore {
    admin_id?: string;
    text: string;
    user_id: string;
}



class MessageService {
    private messagesRepository: Repository<Message>

    constructor() {
        this.messagesRepository = getCustomRepository(MessagesRepository); 

    }

    async index(user_id: string){
        const message = await this.messagesRepository.find({
            where: { user_id },
            relations: ["user"],
        })

        return message;
    }

    async store({admin_id, text, user_id}: IMessageStore) {
        const message = this.messagesRepository.create({
            admin_id,
            text,
            user_id,
        })

        await this.messagesRepository.save(message);

        return message;

    }
}

export { MessageService };