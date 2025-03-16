import User from "./User";

export default interface Team {
    id: number;
    name: string;
    invite_code: string;
    is_admin: boolean;
    members: User[];
    admins: User[];
    
    created_at: Date;
    updated_at: Date;
}