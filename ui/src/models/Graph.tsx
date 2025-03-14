export default interface Graph {
    id: number;
    title: string;
    description: string;
    page: number;
    is_enabled: boolean;
    type: string;
    size: string;
    order: number;
    data_arrays: any[];
    meta: any;

    created_at: Date;
    updated_at: Date;
}