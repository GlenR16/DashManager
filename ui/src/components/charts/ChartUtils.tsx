import Graph from "../../models/Graph";

export interface ChartProps {
    graph: Graph;
}

export const COLORS: string[] = [ 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-info)', 'var(--color-warning)', 'var(--color-success)', 'var(--color-error)' ];

export function sortByCreatedAt(a: any, b: any): number {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

export function sortByDescCreatedAt(a: any, b: any): number {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}