import { model } from "mongoose";
import MessageSchema from "./message.schema";

export const MessageModel = model<MessageText>("messages", MessageSchema);



