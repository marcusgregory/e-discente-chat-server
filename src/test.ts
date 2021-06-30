import { Schema } from "mongoose";
import database from "./database/database"
import { UserModel } from "./models/users.model";


const url = "mongodb+srv://admin:bancoteste@cluster0.c4ckv.mongodb.net/chat?retryWrites=true&w=majority"

const mongoose = require('mongoose')
database.connect();
 
UserModel.findOne({uid:'marcus_gregory'}).then((result:any) => {
  console.log(result)
  mongoose.connection.close()
})