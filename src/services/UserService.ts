import { getCustomRepository, Repository } from "typeorm"

import { User } from '../entities/User';
import { UsersRepository } from "../repositories/UsersRepository"



class UserService{
    private usersRepository: Repository<User>

    constructor() {
        this.usersRepository = getCustomRepository(UsersRepository); 

    }

    async store(email: string) {
        //Verificar se o usuário existe, se não, savá-lo no banco de dados
        const userExists = await this.usersRepository.findOne({
            where: {email}
        })

        if(userExists){
            return userExists;
        }

        const user = this.usersRepository.create({
            email
        });

        await this.usersRepository.save(user);

        return user;

    }
}

export { UserService }