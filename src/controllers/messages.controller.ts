import * as express from 'express'
import { BaseController } from './base.controller'
import jwt from "jsonwebtoken";
import axios from 'axios';
import { GroupModel } from '/home/gregory/NodeJsProjects/chat-server/src/models/groups.model';
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
            if(gid){
                var docs = await MessageModel.find({gid:gid}).sort({_id:1});
                docs.map((doc) => {
                    var data:Date = doc.get('sendAt');
                    data.setHours(data.getHours() -3);
                    doc.set('sendAt',data);
                    return doc;
                });
                return this.ok(res,docs);
            }else{
                this.fail(res,'Grupo inválido')
            }
          


        } catch (err) {
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