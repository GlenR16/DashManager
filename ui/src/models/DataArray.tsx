import DataPoint from "./DataPoint";

export default interface DataArray {
    id: number;
    graph: number;
    data_points: DataPoint[];

    created_at: Date;
    updated_at: Date;
}