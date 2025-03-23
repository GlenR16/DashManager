import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import Error from "../../pages/Error";
import { ChartProps, COLORS } from "./ChartUtils";
import CustomTooltip from "./CustomTooltip";

export default function CustomRadarChart({ graph }: ChartProps): React.ReactElement {
    const data = graph.data_arrays[0]?.data_points?.map((dataPoint: any) => {
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
                        <RadarChart outerRadius={90} width={730} height={250} data={data} >
                            <PolarGrid />
                            <PolarAngleAxis dataKey={graph.meta?.nameKeys[0]} />
                            <Tooltip content={<CustomTooltip graph_type={graph.type} />} />
                            {
                                graph.meta?.dataKeys?.map((dataKey: string, index: number) => (
                                    <Radar key={index} dataKey={dataKey} stroke={COLORS[index]} fill={COLORS[index]} fillOpacity={0.6} />
                                ))
                            }
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                    :
                    <Error message="No data found" />
            }
        </>
    )
}
