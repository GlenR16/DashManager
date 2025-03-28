import moment from "moment";

function colorSelector(payload: any, chart: string): string {
    if (chart === "LINE_CHART" || chart === "AREA_CHART") {
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
            <div className="bg-base-300 p-2 rounded-md border border-primary">
                <p className="font-semibold text-sm">
                    {
                        isNaN(new Date(props.label).getTime()) ?
                            props.label
                            :
                            moment(props.label).format('lll')
                    }
                </p>
                <div className="flex flex-col text-sm">
                    {
                        props.payload.map((pld: any, index: number) => (
                            <div className="inline-flex gap-1" key={index} style={{ color: `${colorSelector(pld, props.graph_type)}` }}>
                                <div>{pld.dataKey}:</div>
                                <div>{pld.value}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}
