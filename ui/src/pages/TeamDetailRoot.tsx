import { ChartBarIcon, DocumentChartBarIcon, InformationCircleIcon, PencilIcon, PlusCircleIcon, Square3Stack3DIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import DeletePageModal from "../components/DeletePageModal";
import Loading from "./Loading";
import Page from "../models/Page";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function TeamDetailRoot(): React.ReactElement {
    const teamId: string | undefined = useParams().id;
    const axios: AxiosInstance = useAxiosAuth();
    const { user } = useUser();
    const pathname = useLocation().pathname;
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pages, setPages] = useState<Page[]>([]);
    const [team, setTeam] = useState<any>({});
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [deletePageId, setDeletePageId] = useState<number>(0);

    async function refreshData() {
        if (!teamId) {
            return;
        }
        axios.get("/team/" + teamId + "/pages")
            .then((response) => {
                setPages(response.data);
                if (response.data.length > 0) {
                    setSelectedPage(response.data[0]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        axios.get("/team/" + teamId)
            .then((response) => {
                setTeam(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
        setIsLoading(false);
    }

    function showDeletePageModal(pageId: number) {
        setDeletePageId(pageId);
        (document.getElementById("deletePageModal") as any).showModal();
    }

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="drawer h-full overflow-hidden">
            <DeletePageModal deletePageId={deletePageId} deletePageName={pages.filter((page: Page) => page.id == deletePageId)[0]?.title} refreshData={refreshData} />
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center h-full overflow-y-scroll">
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
                            {
                                pathname.includes("edit") ? 
                                <li>
                                    <span className="inline-flex items-center gap-2 not-a-link">
                                        <PencilIcon className="w-4 h-4" />
                                        Edit
                                    </span>
                                </li> 
                                :
                                <li>
                                    <span className="inline-flex items-center gap-2 not-a-link">
                                        <DocumentChartBarIcon className="w-4 h-4" />
                                        {selectedPage?.title}
                                    </span>
                                </li>
                            }
                        </ul>
                    </div>
                    {
                        selectedPage && selectedPage.description && !pathname.includes("edit") &&
                        <div className="tooltip tooltip-left" data-tip={selectedPage?.description}>
                            <InformationCircleIcon className="w-6 h-6" />
                        </div>
                    }
                </div>
                <div className="h-full w-full overflow-y-scroll">
                    <Outlet context={{ selectedPage }} />
                </div>
                {
                    !pathname.includes("edit") &&
                    <label htmlFor="my-drawer-2" className="btn btn-circle btn-primary min-h-11 h-11 w-11 drawer-button absolute bottom-6 right-5">
                        <Square3Stack3DIcon className="w-6 h-6" />
                    </label>
                }
            </div>
            <div className="drawer-side h-full">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu menu-lg bg-base-200 text-base-content min-h-full w-80 p-4 gap-1">
                    <div className="flex flex-row items-center justify-between ms-2">
                        <div className="text-xl font-semibold">Pages</div>
                        <NavLink to={`/page/create/team/${teamId}`} className="btn btn-primary min-h-8 h-8" >
                            Add Page
                            <PlusCircleIcon className="w-5 h-5" />
                        </NavLink>
                    </div>
                    <div className="divider p-0 m-0"></div>
                    {
                        isLoading ?
                            <Loading />
                            :
                            (
                                pages.map((page: Page, index: number) => {
                                    return (
                                        <li key={index} className="flex flex-row w-full h-10 join join-horizontal">
                                                <button className={selectedPage?.id == page.id ? "menu-active menu-disabled grow" : "grow"} onClick={() => setSelectedPage(page)}>
                                                    {page.title.length > 14 ? page.title.slice(0, 14) + "..." : page.title }
                                                </button>
                                                {
                                                    selectedPage?.id == page.id && team.admin?.id == user.id &&
                                                    <>
                                                        <NavLink to={"/page/" + page.id + "/edit"} className="btn btn-primary rounded-l-none rounded-r-none min-h-8 h-full">
                                                            <PencilIcon className="w-5 h-5" />
                                                        </NavLink>
                                                        <button className="btn btn-error rounded-l-none rounded-r-md min-h-8 h-full" onClick={() => showDeletePageModal(page.id)}>
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                }
                                        </li>
                                    );
                                })
                            )
                    }
                </ul>
            </div>
        </div>
    )
}
