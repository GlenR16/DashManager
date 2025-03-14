export default interface Page {
    id: number;
    title: string;
    description: string;
    team: number;
    graphs: any[];

    created_at: Date;
    updated_at: Date;
}