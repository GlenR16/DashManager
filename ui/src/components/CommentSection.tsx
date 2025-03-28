import { PaperAirplaneIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Graph from "../models/Graph";
import SubmitButton from "./SubmitButton";
import Error from "../pages/Error";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import { useEffect, useState } from "react";
import moment from "moment";
import { UserContextType, useUser } from "../contexts/UserContext";
import { sortByCreatedAt, sortByDescCreatedAt } from "./charts/ChartUtils";

interface CommentSectionProps {
    graph: Graph;
    refreshBaseData: () => Promise<void>;
}

export default function CommentSection({ graph, refreshBaseData }: CommentSectionProps): React.ReactElement {
    const axios: AxiosInstance = useAxiosAuth();
    const { user }: { user: UserContextType | null } = useUser();
    const [commentForm, setCommentForm] = useState({
        content: ""
    });

    async function deleteComment(commentId: number) {
        return axios.delete(`/comment/${commentId}`)
            .then((response) => {
                refreshBaseData();
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async function addComment() {
        return axios.post(`/graph/${graph.id}/comment`, commentForm)
            .then((response) => {
                refreshBaseData();
                setCommentForm({ content: "" });
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        document.getElementById(`comment_bottom_${graph.id}`)?.scrollIntoView();
    }, [graph.comments]);

    return (
        <dialog id={`Comment_${graph.id}_Modal`} className="modal">
            <div className="modal-box w-11/12 max-w-5xl bg-base-200">
                <div className="flex flex-row justify-between gap-2">
                    <div className="text-lg font-semibold">
                        Comment Section for {graph.title}
                    </div>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost">
                            <XCircleIcon className="h-8 w-8" />
                        </button>
                    </form>
                </div>
                <div className="flex flex-col gap-2 h-86 overflow-y-auto">
                    {
                        graph.comments.length > 0 ?
                            <div className="flex flex-col gap-2 py-2">
                                {
                                    graph.comments.sort(sortByCreatedAt).map((comment, index) => {
                                        return (
                                            <div key={index} className="flex flex-row gap-2 items-start">
                                                <div className="rounded-full avatar border-2 border-primary min-w-10 min-h-10 p-1 flex items-center justify-center">
                                                    {comment.user.name?.split(" ")[0][0].toUpperCase() + comment.user.name?.split(" ")[1][0].toUpperCase()}
                                                </div>
                                                <div className="grow max-w-[90%] flex flex-col gap-1">
                                                    <div className="inline-flex gap-2 items-center text-sm">
                                                        <b>@{comment.user.name}</b> - {moment(comment.created_at).from(moment(new Date()))}
                                                        {
                                                            user && user.id === comment.user.id &&
                                                            <button onClick={() => deleteComment(comment.id)} className="link" >
                                                                <TrashIcon className="w-5 h-5 text-error" />
                                                            </button>
                                                        }
                                                    </div>
                                                    <div>
                                                        {comment.content}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div id={`comment_bottom_${graph.id}`}></div>
                            </div>
                            :
                            <Error message="No comments available" />
                    }
                </div>
                <div className="modal-action flex-row gap-2">
                    <input name="content" type="text" value={commentForm.content} onChange={(e) => setCommentForm({ content: e.target.value })} autoComplete="off" className={`input input-bordered w-full focus:outline-none focus-within:outline-none h-10`} placeholder="Write your comment" />
                    <SubmitButton label="" icon={<PaperAirplaneIcon className="w-6 h-6" />} onClick={addComment} />
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
