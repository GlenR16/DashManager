import { AxiosInstance } from "axios";
import { NavLink, useOutletContext, useParams } from "react-router-dom";
import useAxiosAuth from "../utils/ApiProvider";
import { useEffect, useState } from "react";
import Page from "../models/Page";
import Error from "./Error";
import Graph from "../models/Graph";
import Loading from "./Loading";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import GraphEditCollapse from "../components/GraphEditCollapse";
import DeleteGraphModal from "../components/DeleteGraphModal";

export default function EditPage(): React.ReactElement {
    const pageId = useParams().pageId as string;
    const axios: AxiosInstance = useAxiosAuth();
    const { refreshBaseData } = useOutletContext() as { refreshBaseData: () => Promise<any> };

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteGraphData, setDeleteGraphData] = useState<{ id: number, name: string }>({
        id: 0,
        name: ""
    });
    const [page, setPage] = useState<Page>({
        id: 0,
        title: "",
        description: "",
        team: 0,
        graphs: [],

        created_at: new Date(),
        updated_at: new Date()
    });
    const [team, setTeam] = useState<any>({
        id: 0,
        name: "",
        description: "",
        members: [],

        created_at: new Date(),
        updated_at: new Date()
    });

    async function refreshData() {
        await refreshBaseData();
        return axios.get("/page/" + pageId)
            .then(async (response) => {
                setPage(response.data);
                return axios.get("/team/" + response.data.team)
                    .then((response) => {
                        setTeam(response.data);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error(error);
                        setIsLoading(false);
                    });
                        
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="h-full flex flex-col p-4 gap-4">
            <DeleteGraphModal deleteGraphId={deleteGraphData.id} deleteGraphName={deleteGraphData.name} refreshData={refreshData} />
            <div className="flex flex-row justify-between items-center">
                <div className="text-2xl font-semibold text-center">
                    Edit Page
                </div>
                <NavLink to={`/team/${team.id}/page/${page.id}/graph/create`} className="btn btn-primary min-h-8 h-8" >
                    Create Graph
                    <PlusCircleIcon className="w-6 h-6" />
                </NavLink>
            </div>
            <div className="flex flex-col gap-4">
                {
                    isLoading ?
                        <Loading />
                        :
                        page.graphs.length > 0 ?
                            (
                                <div className="join join-vertical bg-base-100 pb-4">
                                    {
                                        page.graphs.map((graph: Graph, index: number) => {
                                            return (
                                                <GraphEditCollapse key={index} graph={graph} setDeleteGraphData={setDeleteGraphData} refreshData={refreshData} />
                                            );
                                        })
                                    }
                                </div>
                            )
                            :
                            <Error message="No graphs found" />
                }
            </div>
        </div>
    )
}
