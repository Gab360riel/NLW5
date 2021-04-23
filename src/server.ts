import { http } from './http';

import "./websocket/client";
import "./websocket/admin";

http.listen(3333, () => console.log("O servidor está rodando na porta 3333"))
