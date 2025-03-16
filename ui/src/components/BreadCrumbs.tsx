import { ChartBarIcon, DocumentChartBarIcon, PencilIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { NavLink, useParams } from "react-router-dom";
import Team from "../models/Team";
import Page from "../models/Page";

interface BreadCrumbsProps {
    pathname: string;
    team: Team;
    pages: Page[];
    selectedPage: Page | null;
}

export default function BreadCrumbs({ pathname, team, pages, selectedPage }: BreadCrumbsProps): React.ReactElement {
    const teamId: string = useParams().teamId as string;
    const pageId = useParams().pageId as string;
    const graphId = useParams().graphId as string;

    return (
        <div className="breadcrumbs text-sm">
            <ul>
                <li>
                    <NavLink to={"/dashboard"}>
                        <ChartBarIcon className="w-4 h-4" />
                        Dashboard
                    </NavLink>
                </li>
                {
                    pathname.includes("team/create") ?
                        <li>
                            <NavLink to="/team/create" className="inline-flex items-center gap-2">
                                <UserGroupIcon className="w-4 h-4" />
                                Create Team
                            </NavLink>
                        </li>
                        :
                        pathname.includes(`team/${teamId}/edit`) ?
                            <>
                                <li>
                                    <NavLink to={`/team/${teamId}`} className="inline-flex items-center gap-2">
                                        <UserGroupIcon className="w-4 h-4" />
                                        {team?.name}
                                    </NavLink>
                                </li>
                                <li>
                                    <span className="inline-flex items-center gap-2 not-a-link">
                                        <PencilIcon className="w-4 h-4" />
                                        Edit Team
                                    </span>
                                </li>
                            </>
                            :
                            <>
                                <li>
                                    <NavLink to={`/team/${teamId}`} className="inline-flex items-center gap-2">
                                        <UserGroupIcon className="w-4 h-4" />
                                        {team?.name}
                                    </NavLink>
                                </li>
                                <li>
                                    <span className="inline-flex items-center gap-2 not-a-link">
                                        <DocumentChartBarIcon className="w-4 h-4" />
                                        {selectedPage ? selectedPage.title : "Pages"}
                                    </span>
                                </li>
                            </>
                }
                {
                    pathname.includes("page") &&
                    (
                        pathname.includes(`team/${teamId}/page/create`) ?
                            <li>
                                <span className="inline-flex items-center gap-2 not-a-link">
                                    <DocumentChartBarIcon className="w-4 h-4" />
                                    Create Page
                                </span>
                            </li>
                            :
                            pathname.includes(`team/${teamId}/page/${pageId}/edit`) ?
                                <>
                                    <li>
                                        <span className="inline-flex items-center gap-2 not-a-link">
                                            <DocumentChartBarIcon className="w-4 h-4" />
                                            {pages.filter((page: Page) => page.id == parseInt(pageId))[0]?.title}
                                        </span>
                                    </li>
                                    <li>
                                        <span className="inline-flex items-center gap-2 not-a-link">
                                            <PencilIcon className="w-4 h-4" />
                                            Edit Page
                                        </span>
                                    </li>
                                </>
                                :
                                null
                    )
                }
                {
                    pathname.includes(`graph`) &&
                    (
                        pathname.includes(`team/${teamId}/page/${pageId}/graph/create`) ?
                            <li>
                                <span className="inline-flex items-center gap-2 not-a-link">
                                    <ChartBarIcon className="w-4 h-4" />
                                    Create Graph
                                </span>
                            </li>
                            :
                            pathname.includes(`team/${teamId}/page/${pageId}/graph/${graphId}/edit`) ?
                                <>
                                    <li>
                                        <span className="inline-flex items-center gap-2 not-a-link">
                                            <DocumentChartBarIcon className="w-4 h-4" />
                                            {pages.filter((page: Page) => page.id == parseInt(pageId))[0]?.graphs.filter((graph) => graph.id == parseInt(graphId))[0]?.title}
                                        </span>
                                    </li>
                                    <li>
                                        <span className="inline-flex items-center gap-2 not-a-link">
                                            <PencilIcon className="w-4 h-4" />
                                            Edit Graph
                                        </span>
                                    </li>
                                </>
                                :
                                <li>
                                    <span className="inline-flex items-center gap-2 not-a-link">
                                        <DocumentChartBarIcon className="w-4 h-4" />
                                        {pages.filter((page: Page) => page.id == parseInt(pageId))[0]?.title}
                                    </span>
                                </li>
                    )
                }
            </ul>
        </div>
    )
}
