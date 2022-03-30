import { model } from "mongoose";
import UserSchema from "./users.schema";

export const UserModel = model("users", UserSchema);