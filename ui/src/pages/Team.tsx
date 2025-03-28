import React from "react";
import Page from "../models/Page";
import DynamicGraphComponent from "../components/DynamicGraphComponent";
import Graph from "../models/Graph";
import Error from "./Error";
import { useOutletContext } from "react-router-dom";

export default function Team(): React.ReactElement {
    const { selectedPage, refreshBaseData } = useOutletContext() as { selectedPage: Page, refreshBaseData: () => Promise<void> };

    return (
        <div className="h-full w-full flex flex-col p-4">
            {
                selectedPage ?
                    <div className="h-full flex flex-col gap-2">
                        {
                            selectedPage.graphs.filter((graph: Graph) => graph.is_enabled).length > 0 ?
                                (
                                    <div className="grid grid-flow-row gap-2 grid-cols-1 md:grid-cols-2 pb-4">
                                        {
                                            selectedPage.graphs.sort((a, b) => a.order - b.order).filter((graph: Graph) => graph.is_enabled)
                                                .map((graph: Graph, index: number) => {
                                                    return (
                                                        <DynamicGraphComponent key={index} graph={graph} refreshBaseData={refreshBaseData} />
                                                    );
                                                })
                                        }
                                    </div>
                                )
                                :
                                <div className="h-full flex flex-col">
                                    <Error message="No graphs found" />
                                </div>
                        }
                    </div>
                    :
                    <Error message="No pages found" />
            }
        </div>
    )
}