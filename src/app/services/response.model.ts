import { User } from "../models/user.model";

export interface Response {
    total_count:        number;
    incomplete_results: boolean;
    items:              User[];
}