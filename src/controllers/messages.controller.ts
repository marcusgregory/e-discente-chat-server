import * as express from 'express'
import { BaseController } from './base.controller'
import jwt from "jsonwebtoken";
import axios from 'axios';
import { MessageModel } from '../models/message.model';
import MessageSchema from '../models/message.schema';
import moment from 'moment';

class MessagesController extends BaseController {
    constructor() {
        super();
    }


    protected async executeImpl(req: express.Request, res: express.Response): Promise<void | any> {
        try {
            //Obtem o token do usuário por um parametro do header HTTP.
            var tokenJwt: string = String(req.header('jwt'));
            //Verifica se o token é válido.
            //this.verifyToken(tokenJwt,res);
            var gid: string = String(req.params.gid);

            var perPage: number = Number(req.query.perPage ?? 25);
            var page: number = Number(req.query.page ?? 1);
            if(page <=1){
                page = 0;
            }else{
                page = page-1;
            }

            if(gid){
                var docs = await MessageModel.find({gid:gid}).sort({_id:-1}).limit(perPage).skip(page*perPage);
                console.log('Limit: '+perPage+' Skip: '+page*perPage+' Page: '+page);
                // docs.map((doc:any) => {
                //     var data:Date = doc.get('sendAt');
                //     data.setHours(data.getHours() -3);
                //     doc.set('sendAt',data);
                //     return doc;
                // });
                return this.ok(res,docs);
            }else{
                this.fail(res,'Grupo inválido')
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
export default new MessagesController();