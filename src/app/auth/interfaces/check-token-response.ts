import { User } from "./user.interface";

export interface CheckTokenResponse {
    token: string;
    user:  User;
}

