import { AxiosInstance } from "axios";
import SubmitButton from "../components/SubmitButton";
import { useEffect, useState } from "react";
import useAxiosAuth from "../utils/ApiProvider";
import { useOutletContext, useParams } from "react-router-dom";
import Graph from "../models/Graph";
import Team from "../models/Team";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import DataArray from "../models/DataArray";
import DataPoint from "../models/DataPoint";
import AddDataPointModal from "../components/AddDataPointModal";

function displayJson(json: any): string {
    return JSON.stringify(json, null, 2);
}

export default function EditGraph(): React.ReactElement {
    const { team } = useOutletContext() as { team: Team };
    const graphId = useParams().graphId as string;
    const axios: AxiosInstance = useAxiosAuth();
    const [selectedDataArrayId, setSelectedDataArrayId] = useState<number>(0);

    const [graph, setGraph] = useState<Graph>({
        id: 0,
        page: 0,
        title: "",
        description: "",
        is_enabled: false,
        type: "",
        size: "",
        order: 0,
        data_arrays: [],
        comments: [],
        meta: {},

        created_at: new Date(),
        updated_at: new Date()
    });

    async function refreshData() {
        return axios.get("/graph/" + graphId)
            .then((response) => {
                setGraph(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async function addDataArray() {
        return axios.post("/data_array", {
            graph: graph.id
        })
            .then(() => {
                refreshData();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async function deleteDataArray(data_array_id: number) {
        return axios.delete("/data_array/" + data_array_id)
            .then(() => {
                refreshData();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async function deleteDataPoint(data_point_id: number) {
        return axios.delete("/data_point/" + data_point_id)
            .then(() => {
                refreshData();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function showAddDataPointModal(data_array_id: number) {
        setSelectedDataArrayId(data_array_id);
        (document.getElementById("addDataPointModal") as any)?.showModal()
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <AddDataPointModal data_array_id={selectedDataArrayId} refreshData={refreshData} />
            <div className="p-4 flex flex-col gap-4">
                <div className="text-2xl font-semibold text-center">
                    Edit Graph Data
                </div>
                <div className="pb-4">
                    <div className="card bg-base-300 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl justify-between">
                                Graph Data
                                {
                                    team.is_admin &&
                                    <SubmitButton label="Add Data Array" onClick={addDataArray} icon={<PlusCircleIcon className="w-6 h-6" />} />
                                }
                            </h2>
                            <div className="flex flex-col gap-4 py-2">
                                {
                                    graph.data_arrays.map((data_array: DataArray, index: number) => {
                                        return (
                                            <div key={index} className="overflow-x-auto rounded-box border border-base-content/5">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={4}>
                                                                <div className="flex flex-row justify-between">
                                                                    <span className="text-lg text-base-content">
                                                                        Data Array {index + 1}
                                                                    </span>
                                                                    <div className="flex flex-row gap-2">
                                                                        <button className="btn btn-primary min-h-8 h-8" onClick={() => showAddDataPointModal(data_array.id)}>
                                                                            <PlusCircleIcon className="w-5 h-5" />
                                                                            Add Data Point
                                                                        </button>
                                                                        <button className="btn btn-error min-h-8 h-8" onClick={() => deleteDataArray(data_array.id)}>
                                                                            <TrashIcon className="w-4 h-4" />
                                                                            Delete Data Array
                                                                        </button>
                                                                    </div>
                                                                
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <thead>
                                                        <tr>
                                                            <th>Index</th>
                                                            <th>Object</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            data_array.data_points.length > 0 ?
                                                            data_array.data_points.map((data_point: DataPoint, index: number) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <th className="w-14">{index + 1}</th>
                                                                        <td>
                                                                            {displayJson(data_point.object)}
                                                                        </td>
                                                                        <td className="w-16">
                                                                            <div className="flex flex-row gap-2">
                                                                                <button className="btn btn-error min-h-8 h-8" onClick={() => deleteDataPoint(data_point.id)}>
                                                                                    <TrashIcon className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan={3} className="text-center">
                                                                    No data points added yet
                                                                </td>
                                                            </tr>
                                                        }

                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
