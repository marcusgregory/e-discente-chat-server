import app from './app';
const PORT:number = Number(process.env.PORT) || 3000;
app.httpServer.listen(PORT,'0.0.0.0');
