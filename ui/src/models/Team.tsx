export default interface Team {
    id: number;
    name: string;
    admin: any,
    invite_code: string;
    members: any[];
    
    created_at: Date;
    updated_at: Date;
}