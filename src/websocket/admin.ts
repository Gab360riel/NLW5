import { io } from "../http";
import { ConnectionService } from "../services/ConnectionsService";
import { MessageService } from "../services/MessageService";

io.on("connect", async (socket) => {
    const connectionService = new ConnectionService();
    const messageService = new MessageService();

    
    const allConnectionsWithoutAdmin = await connectionService.indexAdmin();

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

    socket.on("admin_list_messages_by_user", async (params, cb) => {
        const { user_id } = params;

        const allMessages = await messageService.index(user_id);

        cb(allMessages);
    });

    socket.on("admin_send_message", async (params) => {
        const { user_id, text } = params;

        await messageService.store({
            text,
            user_id,
            admin_id: socket.id,
        });

        const { socket_id } = await connectionService.index(user_id);

        io.to(socket_id).emit("admin_send_to_client", {
            text,
            socket_id: socket.id,
        });
    });

    socket.on("admin_user_in_support", async (params) => {
        const { user_id } = params;

        await connectionService.updateAdminId(user_id, socket.id);

        const allConnectionsWithoutAdmin = await connectionService.indexAdmin();

        io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
    });
});