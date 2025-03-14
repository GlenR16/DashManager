import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider"
import { useEffect, useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/16/solid";
import { NavLink } from "react-router-dom";
import { UserContextType, useUser } from "../contexts/UserContext";
import { UserCircleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import Error from "./Error";
import Loading from "./Loading";
import DeleteTeamModal from "../components/DeleteTeamModal";
import Team from "../models/Team";
import JoinTeamModal from "../components/JoinTeamModal";

const teamStyles = [
    { "backgroundImage": "linear-gradient(90deg, rgb(237, 237, 237),rgb(236, 236, 236)),linear-gradient(135deg, rgb(163, 125, 62) 0%, rgb(163, 125, 62) 22%,rgb(149, 100, 59) 22%, rgb(149, 100, 59) 32%,rgb(134, 75, 56) 32%, rgb(134, 75, 56) 37%,rgb(120, 50, 53) 37%, rgb(120, 50, 53) 51%,rgb(105, 25, 50) 51%, rgb(105, 25, 50) 55%,rgb(91, 0, 47) 55%, rgb(91, 0, 47) 100%),linear-gradient(112.5deg, rgb(163, 125, 62) 0%, rgb(163, 125, 62) 22%,rgb(149, 100, 59) 22%, rgb(149, 100, 59) 32%,rgb(134, 75, 56) 32%, rgb(134, 75, 56) 37%,rgb(120, 50, 53) 37%, rgb(120, 50, 53) 51%,rgb(105, 25, 50) 51%, rgb(105, 25, 50) 55%,rgb(91, 0, 47) 55%, rgb(91, 0, 47) 100%),linear-gradient(90deg, rgb(163, 125, 62) 0%, rgb(163, 125, 62) 22%,rgb(149, 100, 59) 22%, rgb(149, 100, 59) 32%,rgb(134, 75, 56) 32%, rgb(134, 75, 56) 37%,rgb(120, 50, 53) 37%, rgb(120, 50, 53) 51%,rgb(105, 25, 50) 51%, rgb(105, 25, 50) 55%,rgb(91, 0, 47) 55%, rgb(91, 0, 47) 100%)", "backgroundBlendMode": "overlay, overlay, overlay, normal" },
    { "backgroundImage": "linear-gradient(216deg, rgba(77, 77, 77,0.05) 0%, rgba(77, 77, 77,0.05) 25%,rgba(42, 42, 42,0.05) 25%, rgba(42, 42, 42,0.05) 38%,rgba(223, 223, 223,0.05) 38%, rgba(223, 223, 223,0.05) 75%,rgba(36, 36, 36,0.05) 75%, rgba(36, 36, 36,0.05) 100%),linear-gradient(44deg, rgba(128, 128, 128,0.05) 0%, rgba(128, 128, 128,0.05) 34%,rgba(212, 212, 212,0.05) 34%, rgba(212, 212, 212,0.05) 57%,rgba(25, 25, 25,0.05) 57%, rgba(25, 25, 25,0.05) 89%,rgba(135, 135, 135,0.05) 89%, rgba(135, 135, 135,0.05) 100%),linear-gradient(241deg, rgba(55, 55, 55,0.05) 0%, rgba(55, 55, 55,0.05) 14%,rgba(209, 209, 209,0.05) 14%, rgba(209, 209, 209,0.05) 60%,rgba(245, 245, 245,0.05) 60%, rgba(245, 245, 245,0.05) 69%,rgba(164, 164, 164,0.05) 69%, rgba(164, 164, 164,0.05) 100%),linear-gradient(249deg, rgba(248, 248, 248,0.05) 0%, rgba(248, 248, 248,0.05) 32%,rgba(148, 148, 148,0.05) 32%, rgba(148, 148, 148,0.05) 35%,rgba(202, 202, 202,0.05) 35%, rgba(202, 202, 202,0.05) 51%,rgba(181, 181, 181,0.05) 51%, rgba(181, 181, 181,0.05) 100%),linear-gradient(92deg, hsl(214,0%,11%),hsl(214,0%,11%))" },
    { "backgroundImage": "linear-gradient(131deg, rgba(186, 186, 186, 0.01) 0%, rgba(186, 186, 186, 0.01) 16.667%,rgba(192, 192, 192, 0.01) 16.667%, rgba(192, 192, 192, 0.01) 33.334%,rgba(48, 48, 48, 0.01) 33.334%, rgba(48, 48, 48, 0.01) 50.001000000000005%,rgba(33, 33, 33, 0.01) 50.001%, rgba(33, 33, 33, 0.01) 66.668%,rgba(182, 182, 182, 0.01) 66.668%, rgba(182, 182, 182, 0.01) 83.33500000000001%,rgba(211, 211, 211, 0.01) 83.335%, rgba(211, 211, 211, 0.01) 100.002%),linear-gradient(148deg, rgba(48, 48, 48, 0.01) 0%, rgba(48, 48, 48, 0.01) 16.667%,rgba(178, 178, 178, 0.01) 16.667%, rgba(178, 178, 178, 0.01) 33.334%,rgba(192, 192, 192, 0.01) 33.334%, rgba(192, 192, 192, 0.01) 50.001000000000005%,rgba(237, 237, 237, 0.01) 50.001%, rgba(237, 237, 237, 0.01) 66.668%,rgba(194, 194, 194, 0.01) 66.668%, rgba(194, 194, 194, 0.01) 83.33500000000001%,rgba(227, 227, 227, 0.01) 83.335%, rgba(227, 227, 227, 0.01) 100.002%),linear-gradient(138deg, rgba(146, 146, 146, 0.03) 0%, rgba(146, 146, 146, 0.03) 25%,rgba(33, 33, 33, 0.03) 25%, rgba(33, 33, 33, 0.03) 50%,rgba(46, 46, 46, 0.03) 50%, rgba(46, 46, 46, 0.03) 75%,rgba(172, 172, 172, 0.03) 75%, rgba(172, 172, 172, 0.03) 100%),linear-gradient(38deg, rgba(3, 3, 3, 0.03) 0%, rgba(3, 3, 3, 0.03) 16.667%,rgba(28, 28, 28, 0.03) 16.667%, rgba(28, 28, 28, 0.03) 33.334%,rgba(236, 236, 236, 0.03) 33.334%, rgba(236, 236, 236, 0.03) 50.001000000000005%,rgba(3, 3, 3, 0.03) 50.001%, rgba(3, 3, 3, 0.03) 66.668%,rgba(207, 207, 207, 0.03) 66.668%, rgba(207, 207, 207, 0.03) 83.33500000000001%,rgba(183, 183, 183, 0.03) 83.335%, rgba(183, 183, 183, 0.03) 100.002%),linear-gradient(145deg, rgba(20, 20, 20, 0.02) 0%, rgba(20, 20, 20, 0.02) 20%,rgba(4, 4, 4, 0.02) 20%, rgba(4, 4, 4, 0.02) 40%,rgba(194, 194, 194, 0.02) 40%, rgba(194, 194, 194, 0.02) 60%,rgba(34, 34, 34, 0.02) 60%, rgba(34, 34, 34, 0.02) 80%,rgba(71, 71, 71, 0.02) 80%, rgba(71, 71, 71, 0.02) 100%),linear-gradient(78deg, rgba(190, 190, 190, 0.02) 0%, rgba(190, 190, 190, 0.02) 20%,rgba(95, 95, 95, 0.02) 20%, rgba(95, 95, 95, 0.02) 40%,rgba(71, 71, 71, 0.02) 40%, rgba(71, 71, 71, 0.02) 60%,rgba(7, 7, 7, 0.02) 60%, rgba(7, 7, 7, 0.02) 80%,rgba(130, 130, 130, 0.02) 80%, rgba(130, 130, 130, 0.02) 100%),linear-gradient(293deg, rgba(213, 213, 213, 0.03) 0%, rgba(213, 213, 213, 0.03) 20%,rgba(220, 220, 220, 0.03) 20%, rgba(220, 220, 220, 0.03) 40%,rgba(146, 146, 146, 0.03) 40%, rgba(146, 146, 146, 0.03) 60%,rgba(57, 57, 57, 0.03) 60%, rgba(57, 57, 57, 0.03) 80%,rgba(120, 120, 120, 0.03) 80%, rgba(120, 120, 120, 0.03) 100%),linear-gradient(90deg, rgb(225, 15, 180),rgb(78, 198, 243))" },
    { "backgroundImage": "linear-gradient(246deg, rgba(234, 234, 234, 0.04) 0%, rgba(234, 234, 234, 0.04) 33.3%,rgba(69, 69, 69, 0.04) 33.3%, rgba(69, 69, 69, 0.04) 66.6%,rgba(189, 189, 189, 0.04) 66.6%, rgba(189, 189, 189, 0.04) 99.89999999999999%),linear-gradient(81deg, rgba(126, 126, 126, 0.05) 0%, rgba(126, 126, 126, 0.05) 33.3%,rgba(237, 237, 237, 0.05) 33.3%, rgba(237, 237, 237, 0.05) 66.6%,rgba(74, 74, 74, 0.05) 66.6%, rgba(74, 74, 74, 0.05) 99.89999999999999%),linear-gradient(14deg, rgba(3, 3, 3, 0.08) 0%, rgba(3, 3, 3, 0.08) 33.3%,rgba(156, 156, 156, 0.08) 33.3%, rgba(156, 156, 156, 0.08) 66.6%,rgba(199, 199, 199, 0.08) 66.6%, rgba(199, 199, 199, 0.08) 99.89999999999999%),linear-gradient(323deg, rgba(82, 82, 82, 0.06) 0%, rgba(82, 82, 82, 0.06) 33.3%,rgba(179, 179, 179, 0.06) 33.3%, rgba(179, 179, 179, 0.06) 66.6%,rgba(212, 212, 212, 0.06) 66.6%, rgba(212, 212, 212, 0.06) 99.89999999999999%),linear-gradient(32deg, rgba(70, 70, 70, 0.02) 0%, rgba(70, 70, 70, 0.02) 33.3%,rgba(166, 166, 166, 0.02) 33.3%, rgba(166, 166, 166, 0.02) 66.6%,rgba(53, 53, 53, 0.02) 66.6%, rgba(53, 53, 53, 0.02) 99.89999999999999%),linear-gradient(38deg, rgba(129, 129, 129, 0.09) 0%, rgba(129, 129, 129, 0.09) 33.3%,rgba(38, 38, 38, 0.09) 33.3%, rgba(38, 38, 38, 0.09) 66.6%,rgba(153, 153, 153, 0.09) 66.6%, rgba(153, 153, 153, 0.09) 99.89999999999999%),linear-gradient(63deg, rgba(51, 51, 51, 0.02) 0%, rgba(51, 51, 51, 0.02) 33.3%,rgba(12, 12, 12, 0.02) 33.3%, rgba(12, 12, 12, 0.02) 66.6%,rgba(158, 158, 158, 0.02) 66.6%, rgba(158, 158, 158, 0.02) 99.89999999999999%),linear-gradient(227deg, rgba(63, 63, 63, 0.03) 0%, rgba(63, 63, 63, 0.03) 33.3%,rgba(9, 9, 9, 0.03) 33.3%, rgba(9, 9, 9, 0.03) 66.6%,rgba(85, 85, 85, 0.03) 66.6%, rgba(85, 85, 85, 0.03) 99.89999999999999%),linear-gradient(103deg, rgba(247, 247, 247, 0.07) 0%, rgba(247, 247, 247, 0.07) 33.3%,rgba(93, 93, 93, 0.07) 33.3%, rgba(93, 93, 93, 0.07) 66.6%,rgba(208, 208, 208, 0.07) 66.6%, rgba(208, 208, 208, 0.07) 99%),linear-gradient(0deg, #0b91d7,#6efc29)" },
    { "backgroundImage": "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.11) 0px, rgba(0, 0, 0, 0.11) 12px, rgba(1, 1, 1, 0.16) 12px, rgba(1, 1, 1, 0.16) 24px, rgba(0, 0, 0, 0.14) 24px, rgba(0, 0, 0, 0.14) 36px, rgba(0, 0, 0, 0.23) 36px, rgba(0, 0, 0, 0.23) 48px, rgba(0, 0, 0, 0.12) 48px, rgba(0, 0, 0, 0.12) 60px, rgba(1, 1, 1, 0.07) 60px, rgba(1, 1, 1, 0.07) 72px, rgba(0, 0, 0, 0.21) 72px, rgba(0, 0, 0, 0.21) 84px, rgba(0, 0, 0, 0.24) 84px, rgba(0, 0, 0, 0.24) 96px, rgba(1, 1, 1, 0.23) 96px, rgba(1, 1, 1, 0.23) 108px, rgba(1, 1, 1, 0.07) 108px, rgba(1, 1, 1, 0.07) 120px, rgba(0, 0, 0, 0.01) 120px, rgba(0, 0, 0, 0.01) 132px, rgba(1, 1, 1, 0.22) 132px, rgba(1, 1, 1, 0.22) 144px, rgba(1, 1, 1, 0.24) 144px, rgba(1, 1, 1, 0.24) 156px, rgba(0, 0, 0, 0) 156px, rgba(0, 0, 0, 0) 168px, rgba(0, 0, 0, 0.12) 168px, rgba(0, 0, 0, 0.12) 180px), repeating-linear-gradient(90deg, rgba(1, 1, 1, 0.01) 0px, rgba(1, 1, 1, 0.01) 12px, rgba(1, 1, 1, 0.15) 12px, rgba(1, 1, 1, 0.15) 24px, rgba(0, 0, 0, 0.09) 24px, rgba(0, 0, 0, 0.09) 36px, rgba(0, 0, 0, 0.02) 36px, rgba(0, 0, 0, 0.02) 48px, rgba(0, 0, 0, 0.1) 48px, rgba(0, 0, 0, 0.1) 60px, rgba(1, 1, 1, 0.07) 60px, rgba(1, 1, 1, 0.07) 72px, rgba(1, 1, 1, 0.15) 72px, rgba(1, 1, 1, 0.15) 84px, rgba(0, 0, 0, 0.18) 84px, rgba(0, 0, 0, 0.18) 96px, rgba(1, 1, 1, 0.15) 96px, rgba(1, 1, 1, 0.15) 108px, rgba(1, 1, 1, 0.09) 108px, rgba(1, 1, 1, 0.09) 120px, rgba(1, 1, 1, 0.07) 120px, rgba(1, 1, 1, 0.07) 132px, rgba(1, 1, 1, 0.05) 132px, rgba(1, 1, 1, 0.05) 144px, rgba(0, 0, 0, 0.1) 144px, rgba(0, 0, 0, 0.1) 156px, rgba(1, 1, 1, 0.18) 156px, rgba(1, 1, 1, 0.18) 168px), repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.24) 0px, rgba(0, 0, 0, 0.24) 16px, rgba(1, 1, 1, 0.06) 16px, rgba(1, 1, 1, 0.06) 32px, rgba(0, 0, 0, 0.16) 32px, rgba(0, 0, 0, 0.16) 48px, rgba(1, 1, 1, 0) 48px, rgba(1, 1, 1, 0) 64px, rgba(1, 1, 1, 0.12) 64px, rgba(1, 1, 1, 0.12) 80px, rgba(1, 1, 1, 0.22) 80px, rgba(1, 1, 1, 0.22) 96px, rgba(0, 0, 0, 0.24) 96px, rgba(0, 0, 0, 0.24) 112px, rgba(0, 0, 0, 0.25) 112px, rgba(0, 0, 0, 0.25) 128px, rgba(1, 1, 1, 0.12) 128px, rgba(1, 1, 1, 0.12) 144px, rgba(0, 0, 0, 0.18) 144px, rgba(0, 0, 0, 0.18) 160px, rgba(1, 1, 1, 0.03) 160px, rgba(1, 1, 1, 0.03) 176px, rgba(1, 1, 1, 0.1) 176px, rgba(1, 1, 1, 0.1) 192px), repeating-linear-gradient(135deg, rgba(1, 1, 1, 0.18) 0px, rgba(1, 1, 1, 0.18) 3px, rgba(0, 0, 0, 0.09) 3px, rgba(0, 0, 0, 0.09) 6px, rgba(0, 0, 0, 0.08) 6px, rgba(0, 0, 0, 0.08) 9px, rgba(1, 1, 1, 0.05) 9px, rgba(1, 1, 1, 0.05) 12px, rgba(0, 0, 0, 0.01) 12px, rgba(0, 0, 0, 0.01) 15px, rgba(1, 1, 1, 0.12) 15px, rgba(1, 1, 1, 0.12) 18px, rgba(0, 0, 0, 0.05) 18px, rgba(0, 0, 0, 0.05) 21px, rgba(1, 1, 1, 0.16) 21px, rgba(1, 1, 1, 0.16) 24px, rgba(1, 1, 1, 0.07) 24px, rgba(1, 1, 1, 0.07) 27px, rgba(1, 1, 1, 0.23) 27px, rgba(1, 1, 1, 0.23) 30px, rgba(0, 0, 0, 0.2) 30px, rgba(0, 0, 0, 0.2) 33px, rgba(0, 0, 0, 0.18) 33px, rgba(0, 0, 0, 0.18) 36px, rgba(1, 1, 1, 0.12) 36px, rgba(1, 1, 1, 0.12) 39px, rgba(1, 1, 1, 0.13) 39px, rgba(1, 1, 1, 0.13) 42px, rgba(1, 1, 1, 0.2) 42px, rgba(1, 1, 1, 0.2) 45px, rgba(1, 1, 1, 0.18) 45px, rgba(1, 1, 1, 0.18) 48px, rgba(0, 0, 0, 0.2) 48px, rgba(0, 0, 0, 0.2) 51px, rgba(1, 1, 1, 0) 51px, rgba(1, 1, 1, 0) 54px, rgba(0, 0, 0, 0.03) 54px, rgba(0, 0, 0, 0.03) 57px, rgba(1, 1, 1, 0.06) 57px, rgba(1, 1, 1, 0.06) 60px, rgba(1, 1, 1, 0) 60px, rgba(1, 1, 1, 0) 63px, rgba(0, 0, 0, 0.1) 63px, rgba(0, 0, 0, 0.1) 66px, rgba(1, 1, 1, 0.19) 66px, rgba(1, 1, 1, 0.19) 69px), linear-gradient(90deg, rgb(239, 53, 115), rgb(79, 2, 93))" },
    { "backgroundImage": "linear-gradient(45deg, rgb(20, 222, 124) 0%, rgb(20, 222, 124) 21%,rgb(25, 190, 119) 21%, rgb(25, 190, 119) 37%,rgb(30, 158, 113) 37%, rgb(30, 158, 113) 46%,rgb(35, 126, 108) 46%, rgb(35, 126, 108) 53%,rgb(39, 94, 103) 53%, rgb(39, 94, 103) 59%,rgb(44, 62, 97) 59%, rgb(44, 62, 97) 77%,rgb(49, 30, 92) 77%, rgb(49, 30, 92) 100%)" },
]

export default function Dashboard(): React.ReactElement {
    const { user, updateUser }: { user: UserContextType, updateUser: (user: UserContextType) => Promise<void> } = useUser();
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

    return (
        <div className="h-full flex flex-col p-4">
            <DeleteTeamModal deleteTeamId={deleteTeamModalProps.deleteTeamId} deleteTeamName={deleteTeamModalProps.deleteTeamName} refreshData={refreshData} />
            <JoinTeamModal refreshData={refreshData} />
            <div className="m-2">
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
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {
                        isLoading ?
                            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                <Loading />
                            </div>
                            :
                            teams.length > 0 ? teams.map((team: any, index: number) => {
                                return (
                                    <div className="card bg-base-100 image-full w-full shadow-sm" key={index}>
                                        <figure>
                                            <div className="h-full w-full" style={teamStyles[index % teamStyles.length]}></div>
                                        </figure>
                                        <div className="card-body w-full">
                                            <div className="flex flex-row items-end justify-between w-full">
                                                <div className="card-title text-3xl">
                                                    {team.name}
                                                </div>
                                                <div className="flex flex-row items-center gap-1 mb-1">
                                                    <UserCircleIcon className="w-6 h-6" />
                                                    <div>
                                                        {team.admin.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <NavLink to={"/team/" + team.id} className="btn btn-primary grow min-h-8 h-8 my-2 w-full">
                                                    View
                                                    <EyeIcon className="w-5 h-5" />
                                                </NavLink>
                                                {
                                                    team.admin.id === user.id ? (
                                                        <div className="card-actions w-full flex flex-row items-center justify-center gap-2">
                                                            <NavLink to={"/team/" + team.id + "/edit"} className="btn btn-primary grow min-h-8 h-8">
                                                                Edit
                                                                <PencilIcon className="w-5 h-5" />
                                                            </NavLink>
                                                            <button className="btn btn-primary grow min-h-8 h-8" onClick={() => showDeleteModal(team.id)}>
                                                                Delete
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    )
                                                        : <></>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                                :
                                <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
                                    <Error message="No teams found" />
                                </div>
                    }
                </div>
            </div>
        </div>
    )
}
