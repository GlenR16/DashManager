import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Error from "../../pages/Error";
import CustomTooltip from "./CustomTooltip";
import {ChartProps, COLORS, sortDataPoints} from "./ChartUtils";



export default function CustomLineChart({ graph }: ChartProps): React.ReactElement {
    const data = graph.data_arrays[0]?.data_points?.sort(sortDataPoints).map((dataPoint: any) => {
        return {
            ...dataPoint.object,
            created_at: new Date(dataPoint.created_at).toLocaleString()
        }
    });

    return (
        <>
            {
                graph.data_arrays.length > 0 && graph.data_arrays[0]?.data_points?.length > 0 ?
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart width={730} height={250} data={data} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={"created_at"} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip graph_type={graph.type} />} />
                        <Legend />
                        {
                            graph.meta?.dataKeys?.map((dataKey: string, index: number) => (
                                <Line type="monotone" dataKey={dataKey} key={index} stroke={COLORS[index]} />
                            ))
                        }
                    </LineChart>
                </ResponsiveContainer>
                :
                <Error message="No data found" />
            }
        </>
    )
}
