import * as express from 'express'
import { BaseController } from './base.controller'
import jwt from "jsonwebtoken";
import { UserModel } from '../models/users.model';


class ProfilePicController extends BaseController {
    constructor() {
        super();
    }


    protected async executeImpl(req: express.Request, res: express.Response): Promise<void | any> {
        try {
            //Obtem o token do usuário por um parametro do header HTTP.
            var tokenJwt: string = String(req.header('jwt'));
            //Verifica se o token é válido.
            //this.verifyToken(tokenJwt,res);
            var userName: string = String(req.params.userName);
            if(userName){
                console.log(userName);
                try{
                var docs = await UserModel.findOne({uid:userName});
                var userDoc = docs;
                if(userDoc && userDoc.get('photoUrl')){
                    return res.redirect(userDoc.get('photoUrl'));
                }else{
                    return this.fail(res, 'Não foi possível obter a foto do perfil');
                }
                
                } catch (err:any) {
                    console.log(err);
                    return this.fail(res, err.toString())
                }
              
            }else{
                this.fail(res,'Nome de usuário inválido');
            }
          


        } catch (err:any) {
            return this.fail(res, err.toString())
        }
    }

    verifyToken(tokenJwt:string,res: express.Response){
        if (tokenJwt && tokenJwt !== 'undefined') {
            try {
                jwt.verify(tokenJwt, String(process.env.SECRETKEY));

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
export default new ProfilePicController();