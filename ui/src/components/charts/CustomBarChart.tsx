import { CartesianGrid, Legend, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Error from "../../pages/Error";
import CustomTooltip from "./CustomTooltip";
import {ChartProps, COLORS, sortDataPoints} from "./ChartUtils";


export default function CustomBarChart({ graph }: ChartProps): React.ReactElement {
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
                    <BarChart width={730} height={250} data={data} >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={"created_at"} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip graph_type={graph.type} />} />
                        <Legend />
                        {
                            graph.meta?.dataKeys?.map((dataKey: string, index: number) => (
                                <Bar dataKey={dataKey} key={index} fill={COLORS[index]} />
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
