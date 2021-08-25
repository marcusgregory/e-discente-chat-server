import { Router,Request,Response } from 'express';
import chatsController from './controllers/chats.controller';
import messagesController from './controllers/messages.controller';
import profilePicController from './controllers/profile-pic.controller';
import registerTokenController from './controllers/register_token.controller';

const routes:Router = Router();

routes.get('/', (req:Request, res:Response) => {
  return res.json({ message: 'Olá Mundo' });
});

routes.get('/chats',async (req:Request,res:Response) => chatsController.execute(req,res));
routes.get('/messages/:gid',async (req:Request,res:Response) => messagesController.execute(req,res));
routes.get('/user/profilepic/:userName',async (req:Request,res:Response) => profilePicController.execute(req,res));
routes.post('/user/setFcmToken',async (req:Request,res:Response) => registerTokenController.execute(req,res));

export default routes;