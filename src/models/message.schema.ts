import { Schema } from "mongoose";

const MessageSchema = new Schema<MessageText>(
    {
        mid: {
            type:String,
            require:true,
            unique:true,
        },
        gid: {
            type:String,
            require:true,
        },
        messageText: String,
        type: {
            type: String,
            default:'message'
        },
        sendAt:{
            type: Date,
            default: new Date(),
          },
        sendBy: String,
    }
);
export default MessageSchema;

