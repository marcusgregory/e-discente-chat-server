import mongoose from "mongoose";

class Database {

  private database!: mongoose.Connection;

  constructor() {

  }
  connect() {

    const uri = "mongodb+srv://admin:bancoteste@cluster0.c4ckv.mongodb.net/chat?retryWrites=true&w=majority";
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
