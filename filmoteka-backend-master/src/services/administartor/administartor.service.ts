/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Administrator } from '../../entities/administrator.entity';
import { AddAdministratorDto } from '../../dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from '../../dtos/administrator/edit.administrator.dto';
import { ApiResponse } from '../../misc/api.response.class';
import { AdministratorToken } from 'src/entities/administrator-token.entity';

@Injectable()
export class AdministartorService {
constructor(
    @InjectRepository(Administrator)
    private readonly administrator:Repository<Administrator>,

    @InjectRepository(AdministratorToken)
    private readonly administratorToken:Repository<AdministratorToken>,
){}

    getAll():Promise<Administrator[]>{
        return this.administrator.find();
    }

    async getByUsernamme(username: string): Promise<Administrator | undefined> {
        const admin = await this.administrator.findOne({
            username: username
        });
        if (admin) {
            return admin;
        }
        return undefined;
    }

    getById(id:number):Promise<Administrator>{
        return this.administrator.findOne(id);
    }

    // add 
    add(data: AddAdministratorDto):Promise<Administrator | ApiResponse> {
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();
        let newAdmin: Administrator = new Administrator();
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString;

        return new Promise((resolve) => {
            this.administrator.save(newAdmin)
            .then(data => resolve(data))
            .catch(error => {
                const response: ApiResponse = new ApiResponse("error", -1001);
                resolve(response);
            })
        }) 
    }
    // ediById
    async editById(id: number, data: EditAdministratorDto):Promise<Administrator | ApiResponse> {
        let admin: Administrator = await this.administrator.findOne(id);
        
        if (admin === undefined) {
            return new Promise((resolve) => {
                resolve(new ApiResponse("error", -1002));
            })
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        admin.passwordHash = passwordHashString;

        return this.administrator.save(admin);

    }


    async addToken(administratorId: number, token: string, expiresAt: string) {
        const administratorToken = new AdministratorToken();
        administratorToken.administratorId = administratorId;
        administratorToken.token = token;
        administratorToken.expiresAt = expiresAt;

        return await this.administratorToken.save(administratorToken);
    }

    async getAdministratorToken(token: string): Promise<AdministratorToken> {
        return await this.administratorToken.findOne({
            token: token,
        });
    }

    async invalidateToken(token: string): Promise<AdministratorToken | ApiResponse> {
        const administratorToken = await this.administratorToken.findOne({
            token: token,
        });

        if (!administratorToken) {
            return new ApiResponse("error", -10001, "No such refresh token!");
        }

        administratorToken.isValid = 0;

        await this.administratorToken.save(administratorToken);

        return await this.getAdministratorToken(token);
    }

    async invalidateAdministratorTokens(administratorId: number): Promise<(AdministratorToken | ApiResponse)[]> {
        const administratorTokens = await this.administratorToken.find({
            administratorId: administratorId,
        });

        const results = [];

        for (const administratorToken of administratorTokens ) {
            results.push(this.invalidateToken(administratorToken.token));
        }

        return results;
    }
   
}
