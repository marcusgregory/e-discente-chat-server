import * as express from 'express'
import { BaseController } from './base.controller'
import jwt from "jsonwebtoken";
import axios from 'axios';
import { GroupModel } from '/home/gregory/NodeJsProjects/chat-server/src/models/groups.model';

class ChatsController extends BaseController {
    constructor() {
        super();
    }


    protected async executeImpl(req: express.Request, res: express.Response): Promise<void | any> {
        try {
            //Obtem o token do usuário por um parametro do header HTTP.
            var tokenJwt: string = String(req.header('jwt'));
            //Verifica se o token é válido.
            if (tokenJwt && tokenJwt !== 'undefined') {
                try {
                    var decodedToken: any = jwt.verify(tokenJwt, String(process.env.SECRETKEY));

                } catch (err) {
                    //Usuário não autorizado, token inválido ou expirado.
                    return this.unauthorized(res);
                }
            } else {
                //Token vazio ou não foi passado no header.
                return this.unauthorized(res);
            }

            try {

                var response = await axios.get(process.env.APIUNILABURL + '/sigaa/turmas', {
                    headers: {
                        'jwt': tokenJwt
                    }
                });
                if (response.status === 200) {
                    var grupos: Array<Object> = [];
                    for (var turma of response.data.data) {
                        var idGrupo: string = String(turma.idTurma);
                        var nomeGrupo: string = String(turma.nomeTurma);
                        var query = { gid: idGrupo },
                            update = {
                                gid: idGrupo,
                                name: nomeGrupo,
                                $addToSet: { members: decodedToken.usuario.trim() }
                            },
                            options = { upsert: true, new: true, setDefaultsOnInsert: true };
                        try {
                            var salaDoc: any = await GroupModel.findOneAndUpdate(query, update, options);
                            grupos.push(salaDoc);
                        } catch (err) {
                            return this.fail(res, err);
                        }

                    }
                    return this.ok(res, grupos);

                } else {
                    return this.fail(res, 'status=' + response.status + '\nOcorreu um erro ao obter as turmas ')
                }

            } catch (err) {
                return this.fail(res, err);
            }




        } catch (err) {
            return this.fail(res, err.toString())
        }
    }
}
export default new ChatsController();