export default interface User {
    id: number;
    email: string;
    name: string;

    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;

    last_login: Date;
    created_at: Date;
    updated_at: Date;
}