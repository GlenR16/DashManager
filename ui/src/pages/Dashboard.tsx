import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider"
import { useEffect, useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/16/solid";
import { NavLink } from "react-router-dom";
import { UserContextType, useUser } from "../contexts/UserContext";
import { ArrowRightStartOnRectangleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import Error from "./Error";
import Loading from "./Loading";
import DeleteTeamModal from "../components/DeleteTeamModal";
import Team from "../models/Team";
import JoinTeamModal from "../components/JoinTeamModal";
import moment from "moment";

export default function Dashboard(): React.ReactElement {
    const { updateUser }: { user: UserContextType, updateUser: (user: UserContextType) => Promise<void> } = useUser();
    const axios: AxiosInstance = useAxiosAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [deleteTeamModalProps, setDeleteTeamModalProps] = useState<any>({
        deleteTeamId: 0,
        deleteTeamName: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function refreshData(): Promise<void> {
        return axios.get("/team")
            .then((response) => {
                setTeams(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        refreshData()
            .then(() => {
                axios.get("/user")
                    .then((response) => {
                        updateUser(response.data);
                        setIsLoading(false);
                    });
            });
    }, []);

    function showDeleteModal(teamId: number): void {
        setDeleteTeamModalProps({
            deleteTeamId: teamId,
            deleteTeamName: teams.find((team: Team) => team.id === teamId)?.name,
        });
        const modal: any = document.getElementById("deleteTeamModal");
        if (modal) {
            modal.showModal();
        }
    }

    function showJoinModal(): void {
        const modal: any = document.getElementById("joinTeamModal");
        if (modal) {
            modal.showModal();
        }
    }

    async function leaveTeam(teamId: number): Promise<void> {
        return axios.delete("/team/members", {
            data: {
                team: teamId,
            }
        })
            .then(() => {
                refreshData();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className="h-full flex flex-col p-4">
            <DeleteTeamModal deleteTeamId={deleteTeamModalProps.deleteTeamId} deleteTeamName={deleteTeamModalProps.deleteTeamName} refreshData={refreshData} />
            <JoinTeamModal refreshData={refreshData} />
            <div className="h-full">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-semibold">Teams</h1>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <NavLink to={"/team/create"} className="btn btn-primary min-h-8 h-8">
                            Create Team
                            <PlusIcon className="w-5 h-5" />
                        </NavLink>
                        <button type="button" className="btn btn-primary min-h-8 h-8" onClick={showJoinModal}>
                            Join Team
                            <UserPlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                {
                    isLoading ?
                        <Loading />
                        :
                        teams.length > 0 ?
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {
                                    teams.map((team: any, index: number) => {
                                        return (
                                            <div className="card w-full min-h-46 carbon-fiber" key={index}>
                                                <div className="card-body w-full justify-between p-4">
                                                    <div className="flex flex-row items-start justify-between w-full h-full">
                                                        <div className="flex flex-col justify-between h-full">
                                                            <div className="card-title text-4xl text-accent" style={{ fontFamily: 'Pacifico', letterSpacing: '0.16rem', fontWeight: 400 }} >
                                                                {team.name}
                                                            </div>
                                                            <div className="flex flex-col gap-0 text-sm">
                                                                <div>
                                                                    {moment(new Date(team.created_at)).format("MMM Do YYYY")}
                                                                </div>
                                                                <div>
                                                                    {team.members.length} Members
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <NavLink to={"/team/" + team.id} className="link no-underline text-base inline-flex gap-2 items-center">
                                                            View
                                                            <EyeIcon className="w-6 h-6" />
                                                        </NavLink>
                                                    </div>
                                                    <div className="divider divider-accent m-0"></div>
                                                    <div className="flex flex-row items-center justify-between w-full">
                                                        <button className="link no-underline inline-flex gap-2 items-start text-base" onClick={() => leaveTeam(team.id)}>
                                                            <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
                                                            Leave
                                                        </button>
                                                        {
                                                            team.is_admin ? (
                                                                <div className="flex flex-row gap-4 text-base">
                                                                    <NavLink to={"/team/" + team.id + "/edit"} className="link no-underline inline-flex gap-2 items-center">
                                                                        <PencilIcon className="w-6 h-6" />
                                                                        Edit
                                                                    </NavLink>
                                                                    <button className="link no-underline inline-flex gap-2 items-center" onClick={() => showDeleteModal(team.id)}>
                                                                        <TrashIcon className="w-6 h-6" />
                                                                        Delete
                                                                    </button>
                                                                </div>) : <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            :
                            <div className="h-[calc(100%-2rem)] flex">
                                <Error message="No teams found" />
                            </div>
                }
            </div>
        </div>
    )
}
