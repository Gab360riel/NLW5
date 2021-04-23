import { getCustomRepository, Repository } from 'typeorm';


import { Connection } from '../entities/Connection';
import { ConnectionRepository } from '../repositories/ConnectionsRepository';

interface IConnectionStore {
    socket_id: string;
    user_id: string;
    admin_id?: string;
    id?: string;
}

class ConnectionService {
    private ConnectionsRepository: Repository<Connection>

    constructor() {
        this.ConnectionsRepository = getCustomRepository(ConnectionRepository);
    }

    async store({socket_id, user_id, admin_id, id}: IConnectionStore) {
        const connection = this.ConnectionsRepository.create({
            socket_id,
            user_id,
            admin_id,
            id
        });

        await this.ConnectionsRepository.save(connection);

        return connection;
    }

    
    async index(user_id: string) {
        const user = await this.ConnectionsRepository.findOne({
            user_id,
        })

        return user;
    }

    async indexAdmin() {
        const connections = await this.ConnectionsRepository.find({
            where: {admin_id: null},
            relations: ["user"],
        })

        return connections;
    }

    async indexSocketID(socket_id: string) {
        const connection = await this.ConnectionsRepository.findOne({
            socket_id,
        });

        return connection;
    }

    async updateAdminId(user_id: string, admin_id: string) {
        await this.ConnectionsRepository
            .createQueryBuilder()
            .update(Connection)
            .set({admin_id})
            .where("user_id = :user_id", {
                user_id,
            }).execute();
    }

};

export { ConnectionService };