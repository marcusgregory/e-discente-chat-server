import express from "express";
import http from "http";
import cors from "cors";
import routes from "./routes";
import socketIO from "socket.io";
import database from "./database/database";
import { instrument } from "@socket.io/admin-ui";
//import { UserModel } from "./models/users.model";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
import { MessageModel } from "./models/message.model";
//import authMiddleware from "./middlewares/auth.middleware";
import { UserModel } from "./models/users.model";
import { GroupModel } from "./models/groups.model";
const { createAdapter } = require("@socket.io/mongo-adapter");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
var serviceAccount = require("../firebase/e-discente-2dbb4-firebase-adminsdk-w9dd3-2a4908a372.json");
//import axios from 'axios';
//import { GroupModel } from "./models/groups.model";

class App {

  public server;
  private io: socketIO.Server;
  public httpServer: http.Server;
  private corsOpts = {
    origin: "*",
    allowedHeaders: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }

  constructor() {
    this.server = express();
    this.middlewares();
    this.httpServer = this.buildHttpServer(this.server);
    this.io = this.buildSocketIO()
    this.routes();
    this.socketInit();
  }
  buildHttpServer(server: express.Application): http.Server {
    process.env.TZ = 'America/Sao_Paulo'
    dotenv.config();
    database.connect();
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    return new http.Server(server);
  }

  buildSocketIO(): socketIO.Server {
    return new socketIO.Server(this.httpServer, {
      cors: this.corsOpts
    });

  }
  middlewares() {
    this.server.use(cors(this.corsOpts));
    this.server.use(express.json());
    this.server.use(bodyParser.urlencoded({
      extended: true
    }));
    this.server.use(bodyParser.json());
    //this.server.use(authMiddleware);
  }

  routes() {
    this.server.use(routes);
    this.server.use('/admin', express.static(path.join(__dirname, '/../public')));
    this.server.use('/css', express.static(path.join(__dirname, '/../public/css')));
    this.server.use('/js', express.static(path.join(__dirname, '/../public/js')));
    this.server.use('/img', express.static(path.join(__dirname, '/../public/img')));
  }

  async socketInit() {
    //  database.database.once("open", async () => {
    //   try {
    //     await database.database.db.createCollection('socket.io-adapter-events',{
    //       capped: true,
    //       size: 1e6
    //     });
    //   } catch (e) {
    //     // collection already exists
    //   }finally{
    //     const collection = database.database.db.collection('socket.io-adapter-events');
    //     this.io.adapter(createAdapter(collection));
    //   }
    //  });

    instrument(this.io, {
      auth: false
    });
    this.io.on('connection', async (socket: socketIO.Socket) => {
      console.log('Tentativa de conexão...');
      //pega o token do usuario passado pelo app
      var token = String(socket.handshake.query.token);
      //console.log("query :"+ socket.handshake.query);
      var usuario: any = JSON.parse(String(socket.handshake.query.usuario));
      console.log('socket conectado: ' + socket.id);
      console.log('usuario: ' + usuario.nomeDeUsuario);

      var usuarioToken = '';
      try {
        //verifica se o token é valido
        var decoded: any = jwt.verify(token, String(process.env.SECRETKEY));
        //pega o nome do usuario de dentro do token
        usuarioToken = decoded.usuario;

        var query = { uid: usuario.nomeDeUsuario },
          update = {
            uid: usuario.nomeDeUsuario,
            isOnline: true,
            photoUrl: usuario.urlImagemPerfil
          },
          options = { upsert: true, new: true, setDefaultsOnInsert: true };
        try {
          var user: any = await UserModel.findOneAndUpdate(query, update, options);
          console.log(user);
        } catch (err) {
          socket.disconnect();
        }

      } catch (err) {
        console.log('socket desconectado (Falha no token): ' + socket.id);
        socket.disconnect();
      }

      if (usuarioToken != null && usuarioToken != '') {
        socket.join(usuarioToken);
      } else {
        console.log('socket desconectado (Não passou o token): ' + socket.id);
        socket.disconnect();
      }


      /*  socket.on('listar_grupos',async () => {
          console.log('listando grupos');
          var user:any = await UserModel.findOne({uid:usuario});
          console.log(user.groups);
           socket.emit('grupos',user
           );
        });
            this.io.to('1').emit('receber_mensagem', {
          '_id': null,
          'gid': '1',
          'messageText': 'testeee',
          'sendBy': 'zezinho',
          'sendAt': new Date(),
          'profilePicUrl': 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
        });
       
        */

      socket.on('entrar_nos_grupos', (grupos) => {
        console.log('grupos enviados por ' + usuario.nomeDeUsuario + ' : ' + grupos);
        if (grupos) {
          var listaGrupos: Array<string> = JSON.parse(grupos);
          for (var grupo of listaGrupos) {
            socket.join(grupo);
            console.log(usuario.nomeDeUsuario + ' entrou no grupo: ' + grupo);
          }

        }
      });

      socket.on('evento_digitando', (digitando) => {
        console.log(digitando.sendBy + ' está digitando...');
        socket.to(digitando.gid).volatile.emit('evento_digitando', digitando);
      });

      socket.on('enviar_mensagem', async (message, callback) => {
        try {
          var dateNew = new Date();
          // dateNew.setHours(dateNew.getHours() - 3)
          message['sendAt'] = new Date();
          var msg: any = await MessageModel.create(message);
          console.log(msg);
          callback({
            status: 'ok',
            message: 'Mensagem recebida no servidor',
            server_time: dateNew,
          });
          console.log(usuario.nomeDeUsuario + ' enviou a mensagem: ' + message.messageText);
          //message['sendAt'] = dateNew;
          socket.to(message.gid).emit('receber_mensagem', message);
          var group: any = await GroupModel.findOne({ gid: message.gid });
          console.log(group);
          group.get('members').forEach(async (uid: any) => {
            if (uid != message.sendBy) {
              var user: any = await UserModel.findOne({ uid: uid });
              user.get('fcmTokens').forEach(async (token: any) => {
                await admin.messaging().send({
                   token: token,
                   collapse_key:'new_message',
                  android:{
                    priority:"high"
                  },
                  data: {message:JSON.stringify(message),
                    groupName:group.get('name'),
                    messageTo:user.get('uid')
                  },
                  //topic:String(user.get('uid')).toLowerCase().trim(),
                   notification: {
                     title: 'e-Discente',
                     body: 'Você tem novas mensagens',
                     image: "https://drive.google.com/u/6/uc?id=172rIahoLUV0J1Ya0e9OwJElDj6xk2mv5&export=download"
                   },
                });
              });
            }
          });


        } catch (err) {
          console.log(err);
          callback({
            status: 'error',
            messageError: err.toString,
            message: 'Não foi possível salvar a mensagem no banco de dados'
          });
        }

      });





      socket.on('disconnect', () => {
        console.log('socket desconectado: ' + socket.id);
        console.log('usuario desconectado: ' + usuarioToken);
      });


    });

  }
}

export default new App();