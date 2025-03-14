import { NavLink, useParams } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import { ChartBarIcon, DocumentChartBarIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import { useEffect, useState } from "react";

export default function EditGraph(): React.ReactElement {
    const graphId = useParams().id;
    const axios: AxiosInstance = useAxiosAuth();

    // const [graph, setGraph] = useState<any>(null);
    const [page, setPage] = useState<any>(null);
    const [team, setTeam] = useState<any>(null);

    async function refreshData() {
        return axios.get("/graph/" + graphId)
            .then(async (response) => {
                // setGraphForm(response.data);
                return axios.get("/page/" + response.data.page)
                    .then(async (response) => {
                        setPage(response.data);
                        return axios.get("/team/" + response.data.team)
                            .then((response) => {
                                setTeam(response.data);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-row items-center justify-between w-full bg-primary text-primary-content px-4">
                <div className="breadcrumbs text-sm">
                    <ul>
                        <li>
                            <NavLink to={"/dashboard"}>
                                <ChartBarIcon className="w-4 h-4" />
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/team/${page?.team}`} className="inline-flex items-center gap-2">
                                <UserGroupIcon className="w-4 h-4" />
                                {team?.name}
                            </NavLink>
                        </li>
                        <li>
                            <span className="inline-flex items-center gap-2 not-a-link">
                                <DocumentChartBarIcon className="w-4 h-4" />
                                {page?.title}
                            </span>
                        </li>
                        <li>
                            <span className="inline-flex items-center gap-2 not-a-link">
                                <ChartBarIcon className="w-4 h-4" />
                                Edit Graph Data
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-4">
                <div className="text-2xl font-semibold text-center">
                    Edit Graph Data
                </div>
                <div className="pb-4">
                    <div className="card bg-base-300 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">Graph Data</h2>
                            <div className="flex flex-col gap-4">
                                
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <SubmitButton label="Save" onClick={() => Promise.resolve()} style="btn btn-primary min-h-10 h-10 btn-block" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
