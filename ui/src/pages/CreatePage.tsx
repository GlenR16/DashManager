import { ChartBarIcon, DocumentChartBarIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import SubmitButton from "../components/SubmitButton";
import { NavigateFunction, NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Team from "../models/Team";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import InputField from "../components/InputField";

export default function CreatePage(): React.ReactElement {
    const teamId = useParams().teamId;
    const axios: AxiosInstance = useAxiosAuth();
    const navigate: NavigateFunction = useNavigate();

    const [team, setTeam] = useState<Team | null>(null);
    const [pageForm, setPageForm] = useState<any>({
        title: "",
        description: "",
        team_id: teamId
    });
    const [pageFormErrors, setPageFormErrors] = useState<any>({
        title: "",
        description: ""
    });

    function refreshData() {
        axios.get("/team/" + teamId)
            .then((response) => {
                setTeam(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        refreshData();
    }, []);

    async function submitCreatePage() {
        return axios.post("/page", pageForm)
            .then((_) => {
                navigate("/team/" + teamId);
            })
            .catch((error) => {
                setPageFormErrors({ ...error.response.data });
            });
    }

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
                            <NavLink to={`/team/${teamId}`} className="inline-flex items-center gap-2">
                                <UserGroupIcon className="w-4 h-4" />
                                {team?.name}
                            </NavLink>
                        </li>
                        <li>
                            <span className="inline-flex items-center gap-2 not-a-link">
                                <DocumentChartBarIcon className="w-4 h-4" />
                                Create Page
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-4">
                <div className="text-2xl font-semibold text-center">
                    Create Page
                </div>
                <div className="pb-4">
                    <div className="card bg-base-300 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">Page Details</h2>
                            <InputField name="title" placeholder="" label="Title" error={pageFormErrors.title} type="text" value={pageForm.title} onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })} />
                            <InputField name="description" placeholder="" label="Description" error={pageFormErrors.description} type="text" value={pageForm.description} onChange={(e) => setPageForm({ ...pageForm, description: e.target.value })} />
                            <div className="card-actions justify-end mt-2">
                                <SubmitButton label="Create Page" onClick={submitCreatePage} style="btn btn-primary min-h-10 h-10 btn-block" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
