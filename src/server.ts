import app from './app';
const PORT:number = Number(process.env.PORT) || 3000;
console.log(process.env.PORT);
console.log(PORT);
app.httpServer.listen(PORT,'0.0.0.0');
