import mongoose from "mongoose";

class Database {

  public database!: mongoose.Connection;

  constructor() {

  }
  connect() {
    const DB_USER:string = String(process.env.DB_USER);
    const DB_PASSWORD:string = String(process.env.DB_PASSWORD);
    const DB_HOST:string = String(process.env.DB_HOST);
    const DB_NAME:string = String(process.env.DB_NAME);
    const DB_PORT:string = String(process.env.DB_PORT);
    const uri = "mongodb+srv://"+DB_USER+":"+DB_PASSWORD+"@mongodb:"+DB_PORT+"/"+DB_NAME+"?retryWrites=true&w=majority";
    if (this.database) {
      return;
    }
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    this.database = mongoose.connection;
    this.database.once("open", async () => {
      console.log("Conectado a base de dados");
    });
    this.database.on("error", () => {
      console.log("Erro ao conectar a base de dados");
    });
  };
  disconnect() {
    if (!this.database) {
      return;
    }
    mongoose.disconnect();
  }
}
export default new Database();
