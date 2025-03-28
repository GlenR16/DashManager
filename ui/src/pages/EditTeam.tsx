import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import TextAreaField from "../components/TextAreaField";
import { CheckCircleIcon, ExclamationCircleIcon, ShieldCheckIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import SubmitButton from "../components/SubmitButton";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import KeyField from "../components/KeyField";
import Team from "../models/Team";
import moment from "moment";

export default function EditTeam(): React.ReactElement {
    const teamId = useParams().teamId as string;
    const axios: AxiosInstance = useAxiosAuth();
    const navigate: NavigateFunction = useNavigate();

    const [teamForm, setTeamForm] = useState<Team>({
        id: 0,
        name: "",
        invite_code: "",
        is_admin: false,
        members: [],
        admins: [],
        created_at: new Date(),
        updated_at: new Date(),
    });
    const [teamErrors, setTeamErrors] = useState<any>({
        name: "",
        detail: "",
    });
    const [pageForms, setPageForms] = useState<any[]>([]);
    const [pageErrors, setPageErrors] = useState<any[]>([]);

    async function refreshData() {
        return axios.get("/team/" + teamId)
            .then((response) => {
                setTeamForm(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        refreshData();
        axios.get("/team/" + teamId + "/pages")
            .then((response) => {
                setPageForms(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    async function submitEntireForm() {
        return axios.put("/team/" + teamId, teamForm)
            .then(async (_) => {
                return pageForms.map(async (pageForm, index) => {
                    return axios.put("/page/" + pageForm.id, pageForm)
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

    async function removeAdmin(memberId: number) {
        return axios.delete("/team/admins", { data: { team: teamId, user: memberId } })
            .then((_) => {
                refreshData();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async function makeAdmin(memberId: number) {
        return axios.post("/team/admins", { team: teamId, user: memberId })
            .then((_) => {
                refreshData();
            })
            .catch((error) => {
                console.error(error);
            });
    }


    return (
        <div className="h-full flex flex-col p-4 gap-4">
            <div className="text-2xl font-semibold text-center">
                Edit Team
            </div>
            <div>
                <div className="pb-4 flex flex-col gap-4">
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
                            <KeyField secretKey={teamForm.invite_code} refreshTeamData={refreshData} />
                        </div>
                    </div>
                    <div className="divider m-0">
                        Members
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table bg-base-300 rounded-lg">
                            <thead className="text-primary font-semibold">
                                <tr className="text-base">
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Last Login</th>
                                    <th>Is Active</th>
                                    <th>Is Admin</th>
                                    <th>Admin Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {
                                    teamForm.members.map((member, index) => (
                                        <tr key={index}>
                                            <td>{member.name}</td>
                                            <td>{member.email}</td>
                                            <td>{moment(member.last_login).from(moment(new Date()))}</td>
                                            <td>
                                                {
                                                    member.is_active ? <CheckCircleIcon className="w-6 h-6 text-success ms-5" /> : <XCircleIcon className="h-6 w-6 text-error ms-5"/>
                                                }
                                            </td>
                                            <td>
                                                {
                                                    teamForm.admins.some((admin) => admin.id === member.id) ? <CheckCircleIcon className="w-6 h-6 text-success ms-5" /> : <XCircleIcon className="h-6 w-6 text-error ms-5"/>
                                                }
                                            </td>
                                            <td className="w-50">
                                                {
                                                    teamForm.admins.some((admin) => admin.id === member.id) ?
                                                    <SubmitButton label="Remove Admin" icon={<TrashIcon className="h-6 w-6" />} onClick={async () => removeAdmin(member.id)} style="link no-underline w-full" />
                                                    :
                                                    <SubmitButton label="Make Admin" icon={<ShieldCheckIcon className="h-6 w-6" />} onClick={async () => makeAdmin(member.id)} style="link no-underline w-full" />
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="divider m-0">
                        Pages
                    </div>
                    {
                        pageForms.map((pageForm, index) => (
                            <div className="card bg-base-300 shadow-sm" key={index}>
                                <div className="card-body">
                                    <div className="flex flex-row justify-between">
                                        <div className="text-lg">Page No. {index + 1} </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <InputField name="title" label="Page Title" type="text" value={pageForm.title} onChange={(e) => setPageForms([...pageForms.slice(0, index), { ...pageForm, title: e.target.value }, ...pageForms.slice(index + 1)])} placeholder="" error={pageErrors[index]?.title} />
                                        <TextAreaField name="description" label="Page Description" value={pageForm.description} onChange={(e) => setPageForms([...pageForms.slice(0, index), { ...pageForm, description: e.target.value }, ...pageForms.slice(index + 1)])} placeholder="" error={pageErrors[index]?.description} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    <div className="card-actions justify-end">
                        <SubmitButton label="Save" onClick={submitEntireForm} style="btn-primary btn-block" />
                    </div>
                </div>
            </div>
        </div>
    )
}
