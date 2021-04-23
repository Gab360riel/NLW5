import { io } from '../http';

import { ConnectionService } from '../services/ConnectionsService';
import { UserService } from '../services/UserService';
import { MessageService } from '../services/MessageService';

interface IParams {
    text: string,
    email: string,
};

io.on("connect", (socket) => {
    const connectionService = new ConnectionService();
    const usersService = new UserService();
    const messageService = new MessageService();


    socket.on("client_first_acess", async (params) => {

        const socket_id = socket.id;

        const { text, email } = params as IParams;

        let user_id = null;

        //Salvar a conexão com socket_id, user_id

        const userExists = await usersService.index(email);

        if(!userExists) {
            const user = await usersService.store(email);

            await connectionService.store({
                socket_id,
                user_id: user.id,
            });

            user_id = user.id;
        } else {
            user_id = userExists.id;
            const connection = await connectionService.index(userExists.id);
            
            if(!connection){
                await connectionService.store({
                    socket_id,
                    user_id: userExists.id,
                })
            } else {
                connection.socket_id = socket_id;
                await connectionService.store(connection)
            }
        }

        await messageService.store({
            text,
            user_id,
        })

    })
});