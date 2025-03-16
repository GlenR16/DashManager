import Graph from "./Graph";

export default interface Page {
    id: number;
    title: string;
    description: string;
    team: number;
    graphs: Graph[];

    created_at: Date;
    updated_at: Date;
}