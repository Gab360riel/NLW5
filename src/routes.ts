import {Router} from "express";

import { SettingsController } from './controller/SettingsController';
import { UserController } from './controller/UsersController';
import { MessagesController } from './controller/MessagesController';

const routes = Router();

const settingsController = new SettingsController();
const usersController = new UserController();
const messageController = new MessagesController();

routes.get("/settings/:username", settingsController.index);
routes.post("/settings", settingsController.store);
routes.put("/settings/:username", settingsController.update);

routes.post("/users", usersController.store);

routes.get("/messages/:id", messageController.index);
routes.post("/messages", messageController.store);

export { routes };