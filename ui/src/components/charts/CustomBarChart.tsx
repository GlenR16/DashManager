import { CartesianGrid, Legend, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Graph from "../../models/Graph";
import Error from "../../pages/Error";
import CustomTooltip from "./CustomTooltip";

interface BarChartProps {
    graph: Graph;
}
const colors: string[] = [ 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-info)', 'var(--color-warning)', 'var(--color-success)', 'var(--color-error)' ];

export default function CustomBarChart({ graph }: BarChartProps): React.ReactElement {
    const data = graph.data_arrays[0]?.data_points?.map((dataPoint: any) => {
        return dataPoint.object;
    });

    return (
        <>
            {
                graph.data_arrays.length > 0 && graph.data_arrays[0]?.data_points?.length > 0 ?
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart width={730} height={250} data={data} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip graph_type={graph.type} />} />
                        <Legend />
                        {
                            graph.meta?.dataKeys?.map((dataKey: string, index: number) => (
                                <Bar dataKey={dataKey} key={index} fill={colors[index]} />
                            ))
                        }
                    </BarChart>
                </ResponsiveContainer>
                :
                <Error message="No data found" />
            }
        </>
    )
}
