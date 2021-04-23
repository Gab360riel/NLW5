import { getCustomRepository, Repository } from "typeorm";

import { Setting } from '../entities/Setting';
import { SettingsRepository } from "../repositories/SettingsRepository";

interface ISettingsStore {
    username: string;
    chat: boolean;
}

class SettingsService{
    private settingsRepository: Repository<Setting>

    constructor() {
        this.settingsRepository = getCustomRepository(SettingsRepository); 

    }

    async index(username: string) {
        const settings = await this.settingsRepository.findOne({
            username
        })

        return settings;
    }

    async store({chat, username}: ISettingsStore){
        const userAExists = await this.settingsRepository.findOne({
            where: { username }
        })
        
        if(userAExists){
            throw new Error("User already exists");
        }

        const settings = this.settingsRepository.create({
            username,
            chat,
        })

        await this.settingsRepository.save(settings);

        return settings;
    }

    async update(username: string, chat: boolean) {
        await this.settingsRepository.createQueryBuilder()
          .update(Setting)
          .set({ chat })
          .where("username = :username", {
              username,
          }).execute();
    }
};



export { SettingsService };