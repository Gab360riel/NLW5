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
        const allMessages = await messageService.index(user_id);

        socket.emit("client_list_all_messages", allMessages);

        const allUsers = await connectionService.indexAdmin();
        io.emit("admin_list_all_users", allUsers);

    });

    socket.on("client_send_to_admin", async (params) => {
        const { text, socket_admin_id } = params;

        const socket_id = socket.id;

        const { user_id } = await connectionService.indexSocketID(socket_id);


        const message = await messageService.store({
            text,
            user_id,
        });

        io.to(socket_admin_id).emit("admin_recieve_message", {
            message,
            socket_id
        })
    });
});