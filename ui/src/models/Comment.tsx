import User from "./User";

export default interface Comment {
    id: number;
    user: User;
    graph: number;
    content: string;
    
    created_at: Date;
    updated_at: Date;
}