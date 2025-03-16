import { useState } from "react";
import InputField from "../components/InputField";
import TextAreaField from "../components/TextAreaField";
import { ChartBarIcon, ExclamationCircleIcon, MinusCircleIcon, PlusIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import SubmitButton from "../components/SubmitButton";
import { NavigateFunction, NavLink, useNavigate } from "react-router-dom";

export default function CreateTeam(): React.ReactElement {
    const axios: AxiosInstance = useAxiosAuth();
    const navigate: NavigateFunction = useNavigate();

    const [teamForm, setTeamForm] = useState<any>({
        name: ""
    });
    const [teamErrors, setTeamErrors] = useState<any>({
        name: "",
        detail: "",
    });
    const [pageForms, setPageForms] = useState<any[]>([]);
    const [pageErrors, setPageErrors] = useState<any[]>([]);

    function addPage() {
        setPageForms([...pageForms, { title: "", description: "" }]);
        setPageErrors([...pageErrors, { title: "", description: "" }]);
    }

    function removePage(index: number) {
        setPageForms([...pageForms.slice(0, index), ...pageForms.slice(index + 1)]);
        setPageErrors([...pageErrors.slice(0, index), ...pageErrors.slice(index + 1)]);
    }

    async function submitEntireForm() {
        return axios.post("/team", teamForm)
            .then(async (response) => {
                const teamId = response.data.id;
                return pageForms.map(async (pageForm, index) => {
                    return axios.post("/page", { ...pageForm, team: teamId })
                        .then((_) => {
                            return true;
                        })
                        .catch((error) => {
                            setTeamErrors({ name: "", detail: "Team was created but some pages were not created. Go to the team page to continue further editing." });
                            setPageErrors([...pageErrors.slice(0, index), error.response.data, ...pageErrors.slice(index + 1)]);
                            return false;
                        });
                });
            })
            .then((promises) => {
                Promise.all(promises).then((response) => {
                    if (response.every((value) => value === true)) {
                        navigate("/dashboard");
                    }
                });
            })
            .catch((error) => {
                setTeamErrors({ ...error.response.data });
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
                            <span className="inline-flex items-center gap-2 not-a-link">
                                <UserGroupIcon className="w-4 h-4" />
                                Create Team
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="p-4 flex flex-col gap-4">
                <div className="text-2xl font-semibold text-center">
                    Create Team
                </div>
                <div className="pb-4">
                    <div className="card bg-base-300 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">Team Details</h2>
                            <InputField name="name" label="Team Name" type="text" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="" error={teamErrors.name} />
                            {
                                teamErrors?.detail &&
                                <div role="alert" className="alert alert-error">
                                    <ExclamationCircleIcon className="w-6 h-6" />
                                    <span>
                                        {teamErrors.detail}
                                    </span>
                                </div>
                            }
                            <div className="divider m-1"></div>
                            <h2 className="card-title text-2xl">Page Details</h2>
                            {
                                pageForms.map((pageForm, index) => (
                                    <div key={index}>
                                        <div className="flex flex-row justify-between">
                                            <div className="text-lg">Page No. {index + 1} </div>
                                            <button className="btn btn-error min-h-8 h-8" onClick={() => removePage(index)}>
                                                Remove Page
                                                <MinusCircleIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <InputField name="title" label="Page Title" type="text" value={pageForm.title} onChange={(e) => setPageForms([...pageForms.slice(0, index), { ...pageForm, title: e.target.value }, ...pageForms.slice(index + 1)])} placeholder="" error={pageErrors[index]?.title} />
                                            <TextAreaField name="description" label="Page Description" value={pageForm.description} onChange={(e) => setPageForms([...pageForms.slice(0, index), { ...pageForm, description: e.target.value }, ...pageForms.slice(index + 1)])} placeholder="" error={pageErrors[index]?.description} />
                                        </div>
                                    </div>
                                ))
                            }
                            <button className="btn btn-block btn-secondary min-h-10 h-10" onClick={addPage}>
                                Add Page
                                <PlusIcon className="w-6 h-6" />
                            </button>
                            <div className="card-actions justify-end">
                                <SubmitButton label="Create Team" onClick={submitEntireForm} style="btn-primary btn-block" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
