import mongoose from "mongoose";

class Database {

  public database!: mongoose.Connection;

  constructor() {

  }
  connect() {
 console.log(process.env.DB_HOST);
    const uri = String(process.env.DB_HOST);
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
