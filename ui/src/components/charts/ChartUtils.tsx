import Graph from "../../models/Graph";

export interface ChartProps {
    graph: Graph;
}

export const COLORS: string[] = [ 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-info)', 'var(--color-warning)', 'var(--color-success)', 'var(--color-error)' ];

export function sortDataPoints(a: any, b: any): number {
    return a.created_at - b.created_at;
}