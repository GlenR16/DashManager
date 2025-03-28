import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartProps, COLORS, sortByCreatedAt } from './ChartUtils'
import Error from '../../pages/Error'
import CustomTooltip from './CustomTooltip';

export default function CustomAreaChart({ graph }: ChartProps): React.ReactElement {
    const data = graph.data_arrays[0]?.data_points?.sort(sortByCreatedAt).map((dataPoint: any) => {
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
                    <AreaChart width={730} height={250} data={data} >
                        <defs>
                            {
                                COLORS.map((color: string, index: number) => (
                                    <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                ))
                            }
                        </defs>
                        <XAxis dataKey={"created_at"} />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip content={<CustomTooltip graph_type={graph.type} />} />
                        <Legend />
                        {
                            graph.meta?.dataKeys?.map((dataKey: string, index: number) => (
                                <Area type="monotone" key={index} dataKey={dataKey} stroke={COLORS[index]} fillOpacity={1} fill={`url(#color${index%COLORS.length})`} />
                            ))
                        }
                    </AreaChart>
                </ResponsiveContainer>
                :
                    <Error message="No data found" />
            }
        </>
    )
}
