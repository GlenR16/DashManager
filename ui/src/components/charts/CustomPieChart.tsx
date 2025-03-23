import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import CustomTooltip from "./CustomTooltip";
import DataArray from "../../models/DataArray";
import Error from "../../pages/Error";
import DataPoint from "../../models/DataPoint";
import { ChartProps, COLORS } from "./ChartUtils";

export default function CustomPieChart({ graph }: ChartProps): React.ReactElement {
    return (
        <>
            {
                graph.data_arrays.length > 0 && graph.data_arrays[0]?.data_points?.length > 0 ?
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={730} height={250} >
                            <Tooltip content={<CustomTooltip graph_type={graph.type} />} />
                            <Legend />
                            {
                                graph.data_arrays.map((dataArray: DataArray, oindex: number) => (
                                    <Pie key={oindex} data={dataArray.data_points.map((data_point: DataPoint) => data_point.object)} dataKey={graph.meta?.dataKeys[oindex]} nameKey={graph.meta?.nameKeys[oindex]}>
                                        {dataArray.data_points.map((data_point: DataPoint) => data_point.object).map((_, iindex) => (
                                            <Cell key={`${oindex}-${iindex}`} fill={COLORS[iindex % COLORS.length]} />
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
