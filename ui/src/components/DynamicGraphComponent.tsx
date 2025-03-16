import { ArrowDownTrayIcon, ChatBubbleOvalLeftEllipsisIcon, InformationCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";
import Graph from "../models/Graph";
import CustomLineChart from "./charts/CustomLineChart";
import { json2csv } from "json-2-csv";
import DataArrays from "../models/DataArray";
import CustomBarChart from "./charts/CustomBarChart";
import Error from "../pages/Error";
import CustomPieChart from "./charts/CustomPieChart";

interface DynamicGraphComponentProps {
    graph: Graph;
}

const baseClass = "rounded-box border-2 border-primary bg-base-100 h-64 p-2 flex flex-col gap-2";

function renderGraph(graph: Graph) {
    switch (graph.type) {
        case "LINE_CHART":
            return <CustomLineChart graph={graph} />
        case "BAR_CHART":
            return <CustomBarChart  graph={graph} />
        case "PIE_CHART":
            return <CustomPieChart graph={graph} />
        default:
            return <Error message="Graph type not supported" />
    }
}

export default function DynamicGraphComponent({ graph }: DynamicGraphComponentProps): React.ReactElement {
    function downloadDataArraysAsCSV() {
        graph.data_arrays.forEach((data_array: DataArrays, index: number) => {
            if (data_array.data_points.length > 0) {
                const csv = json2csv(data_array.data_points);
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = graph.title + `_${index}` + '.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    }
    return (
        <div className={graph.size == "FULL" ? baseClass + " col-span-1 md:col-span-2" : baseClass + " col-span-1"}>
            <div className="flex flex-row items-center justify-between ps-2 pb-1">
                <div className="font-semibold flex flex-row items-center gap-2">
                    {graph.title}
                    {
                        new Date(graph.created_at) > new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7) &&
                        <span className="badge badge-xs badge-accent">New</span>
                    }
                </div>
                <div className="flex flex-row items-center gap-2">
                    <div className="tooltip tooltip-left" data-tip={graph.description} >
                        <InformationCircleIcon className="w-6 h-6" />
                    </div>
                    <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
                    <SparklesIcon className="w-6 h-6" />
                    {
                        graph.data_arrays.length > 0 && graph.data_arrays[0].data_points.length > 0 &&
                        <button onClick={downloadDataArraysAsCSV} className="link" >
                            <ArrowDownTrayIcon className="w-6 h-6" />
                        </button>
                    }
                </div>
            </div>
            <div className="grow w-full">
                {
                    renderGraph(graph)
                }
            </div>
        </div>
    )
}
