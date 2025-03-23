import Comment from "./Comment";
import DataArray from "./DataArray";

export default interface Graph {
    id: number;
    title: string;
    description: string;
    page: number;
    is_enabled: boolean;
    type: string;
    size: string;
    order: number;
    data_arrays: DataArray[];
    comments: Comment[];
    meta: any;

    created_at: Date;
    updated_at: Date;
}