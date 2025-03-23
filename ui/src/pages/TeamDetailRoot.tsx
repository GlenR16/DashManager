import { InformationCircleIcon, PencilIcon, PlusCircleIcon, Square3Stack3DIcon, TrashIcon } from "@heroicons/react/24/solid";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import DeletePageModal from "../components/DeletePageModal";
import Loading from "./Loading";
import Page from "../models/Page";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import { useEffect, useState } from "react";
import Error from "./Error";
import BreadCrumbs from "../components/BreadCrumbs";

export default function TeamDetailRoot(): React.ReactElement {
    const teamId: string = useParams().teamId as string;

    const axios: AxiosInstance = useAxiosAuth();
    const pathname = useLocation().pathname;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [pages, setPages] = useState<Page[]>([]);
    const [team, setTeam] = useState<any>({});
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [deletePageId, setDeletePageId] = useState<number>(0);

    async function refreshBaseData() {
        if (!teamId) {
            setIsLoading(false);
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
        refreshBaseData();
    }, []);

    return (
        <>
            {
                !pathname.includes("edit") &&
                <label htmlFor="my-drawer-2" className="btn btn-circle btn-accent min-h-11 h-11 w-11 drawer-button absolute bottom-6 right-5 z-50">
                    <Square3Stack3DIcon className="w-6 h-6" />
                </label>
            }
            <div className="drawer">
                <DeletePageModal deletePageId={deletePageId} deletePageName={pages.filter((page: Page) => page.id == deletePageId)[0]?.title} refreshData={refreshBaseData} />
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center justify-center">
                    <div className="flex flex-row items-center justify-between w-full bg-primary text-primary-content px-4">
                        <BreadCrumbs pathname={pathname} team={team} pages={pages} selectedPage={selectedPage} />
                        {
                            selectedPage && selectedPage.description && !pathname.includes("edit") &&
                            <div className="tooltip tooltip-left">
                                <div className="tooltip-content max-w-120">
                                    {selectedPage.description}
                                </div>
                                <InformationCircleIcon className="w-6 h-6" />
                            </div>
                        }
                    </div>
                    <div className="grow w-full">
                        <Outlet context={{ team, selectedPage, refreshBaseData }} />
                    </div>
                </div>
                <div className="drawer-side h-full">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu menu-lg bg-base-200 text-base-content min-h-full w-80 p-4 gap-1">
                        <div className="flex flex-row items-center justify-between ms-2">
                            <div className="text-xl font-semibold">Pages</div>
                            {
                                team.is_admin &&
                                <NavLink to={`/team/${teamId}/page/create`} className="btn btn-primary min-h-8 h-8" >
                                    Add Page
                                    <PlusCircleIcon className="w-5 h-5" />
                                </NavLink>
                            }
                        </div>
                        <div className="divider p-0 m-0"></div>
                        {
                            isLoading ?
                                <Loading />
                                :
                                (
                                    pages.length > 0 ?
                                        pages.map((page: Page, index: number) => {
                                            return (
                                                <li key={index} className="flex flex-row w-full h-10 join join-horizontal">
                                                    <button className={selectedPage?.id == page.id ? `menu-active menu-disabled grow ${team.is_admin ? "rounded-r-none" : ""}` : "grow"} onClick={() => setSelectedPage(page)}>
                                                        {page.title.length > 14 ? page.title.slice(0, 14) + "..." : page.title}
                                                    </button>
                                                    {
                                                        selectedPage?.id == page.id && team.is_admin &&
                                                        <>
                                                            <NavLink to={`/team/${teamId}/page/${page.id}/edit`} className="btn btn-primary rounded-l-none rounded-r-none min-h-8 h-full">
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
                                        :
                                        <Error message="No pages found" />
                                )
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}
