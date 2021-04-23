import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';


import { SettingsRepository } from '../repositories/SettingsRepository';
import { SettingsService } from "../services/SettingsService";


class SettingsController {
    async index(req: Request, res: Response) {
        const { username } = req.params;

        const settingsService = new SettingsService();

        const settings = await settingsService.index(username);

        return settings;
    }


    async store(req: Request, res: Response): Promise<Response>{
        const { username, chat} = req.body;

        const settingService = new SettingsService();

        try {
            const settings = await settingService.store({username, chat});

            return res.json(settings);
        }catch(err) {
            return res.status(400).json({error: err.message})
        }
    }
}

export { SettingsController };