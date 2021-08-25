import * as express from 'express'
import { BaseController } from './base.controller'
import jwt from "jsonwebtoken";
import axios from 'axios';
import { MessageModel } from '../models/message.model';
import MessageSchema from '../models/message.schema';
import moment from 'moment';
import { UserModel } from '../models/users.model';

class RegisterTokenController extends BaseController {
    constructor() {
        super();
    }


    protected async executeImpl(req: express.Request, res: express.Response): Promise<void | any> {
        try {
            //Obtem o token do usuário por um parametro do header HTTP.
           var tokenJwt: string = String(req.header('jwt'));
            //Verifica se o token é válido.
           var decodedToken = Object(this.verifyToken(tokenJwt,res));
            var fcmToken: string = String(req.body.fcmToken);
            if(fcmToken && decodedToken && fcmToken.trim() != '' && fcmToken != 'undefined'){
                var query = {uid:decodedToken.usuario.trim()},
                            update = {
                                $addToSet: { fcmTokens: fcmToken.trim() },
                            },
                            options = { upsert: true, new: true, setDefaultsOnInsert: true }; 
                
                var docs = await UserModel.findOneAndUpdate(query, update, options);
                console.log('O usuário '+decodedToken.usuario.trim()+' registrou o fcmToken: '+ fcmToken.trim());
                return this.ok(res,docs);
            }else{
                this.fail(res,'token inválido!')
            }
          


        } catch (err) {
            return this.fail(res, err.toString())
        }
    }

    verifyToken(tokenJwt:string,res: express.Response){
        if (tokenJwt && tokenJwt !== 'undefined') {
            try {
              return jwt.verify(tokenJwt, String(process.env.SECRETKEY));

            } catch (err) {
                //Usuário não autorizado, token inválido ou expirado.
                return this.unauthorized(res);
            }
        } else {
            //Token vazio ou não foi passado no header.
            return this.unauthorized(res);
        }

    }
}
export default new RegisterTokenController();