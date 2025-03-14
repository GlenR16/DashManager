

function colorSelector(payload: any, chart: string): string{
    if (chart === "LINE_CHART") {
        return payload.stroke;
    }
    else if (chart === "BAR_CHART") {
        return payload.fill;
    }
    return payload.fill;
}

export default function CustomTooltip(props: any): React.ReactNode | Promise<React.ReactNode> {
    if (props.active) {
        return (
            <div className="bg-base-300 p-2 rounded-md">
                <p className="text-lg font-semibold">{props.label}</p>
                <div className="flex flex-col">
                    {
                        props.payload.map((pld: any, index: number) => (
                            <div className="inline-flex gap-1" key={index}>
                                <div>{pld.dataKey}:</div>
                                <div style={{ color: `${ colorSelector(pld, props.graph_type) }` }}>{pld.value}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}
