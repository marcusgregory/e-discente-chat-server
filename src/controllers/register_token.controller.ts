import * as express from 'express'
import { BaseController } from './base.controller'
import jwt from "jsonwebtoken";
import { GroupModel } from '../models/groups.model';
import { UpdateQuery } from 'mongoose';

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
            var query = {
                uid:decodedToken.usuario};
                 var update = {
                            uid:decodedToken.usuarioToken,
                            $addToSet: { fcmTokens: fcmToken },
                        };
                        var options = { upsert: true, new: true, setDefaultsOnInsert: true }; 
            if(fcmToken != null && decodedToken != null && fcmToken.trim() != '' && fcmToken != 'undefined'){
                
                var docs = await GroupModel.findOneAndUpdate(query,update as UpdateQuery<object>,options);
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