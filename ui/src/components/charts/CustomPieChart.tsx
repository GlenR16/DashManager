import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import CustomTooltip from "./CustomTooltip";
import Graph from "../../models/Graph";
import DataArrays from "../../models/DataArray";
import Error from "../../pages/Error";
import DataPoint from "../../models/DataPoint";

interface PieChartProps {
    graph: Graph;
}

const colors: string[] = ['var(--color-secondary)', 'var(--color-accent)', 'var(--color-info)', 'var(--color-warning)', 'var(--color-success)', 'var(--color-error)'];

export default function CustomPieChart({ graph }: PieChartProps): React.ReactElement {
    return (
        <>
            {
                graph.data_arrays.length > 0 && graph.data_arrays[0]?.data_points?.length > 0 ?
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={730} height={250} >
                            <Tooltip content={<CustomTooltip graph_type={graph.type} />} />
                            <Legend />
                            {
                                graph.data_arrays.map((dataArray: DataArrays, oindex: number) => (
                                    <Pie key={oindex} data={dataArray.data_points.map((data_point: DataPoint) => data_point.object)} dataKey={graph.meta.dataKey} nameKey={graph.meta.nameKey}>
                                        {dataArray.data_points.map((data_point: DataPoint) => data_point.object).map((_, iindex) => (
                                            <Cell key={`${oindex}-${iindex}`} fill={colors[iindex % colors.length]} />
                                        ))}
                                    </Pie>
                                ))
                            }
                        </PieChart>
                    </ResponsiveContainer>
                    :
                    <Error message="No data found" />
            }
        </>
    )
}
