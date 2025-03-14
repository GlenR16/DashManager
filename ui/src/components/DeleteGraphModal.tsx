import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import SubmitButton from "./SubmitButton";
import useAxiosAuth from "../utils/ApiProvider";
import { AxiosInstance } from "axios";

interface DeleteGraphModalProps {
    deleteGraphId: number;
    deleteGraphName: string;
    refreshData: () => Promise<void>;
}

export default function DeleteGraphModal({ deleteGraphId, deleteGraphName, refreshData }: DeleteGraphModalProps): React.ReactElement {
    const axios: AxiosInstance = useAxiosAuth();

    async function deleteGraph() {
        return axios.delete("/graph/" + deleteGraphId)
            .then(() => {
                refreshData();
                (document.getElementById("deleteGraphModal") as any)?.close();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <dialog id="deleteGraphModal" className="modal">
            <div className="modal-box bg-base-200">
                <div className="sm:flex sm:items-start">
                    <ExclamationCircleIcon className="h-24 w-24 text-error" />
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-xl font-semibold leading-6" id="modal-title">
                            Delete graph `{deleteGraphName}`
                        </h3>
                        <div className="mt-2">
                            <p className="">
                                Are you sure you want to
                                <span className="font-semibold text-error"> delete </span>
                                this graph ? This action cannot be undone. All graph data will also be deleted from the database and cannot be recovered.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog" className="w-full">
                        <button className="btn btn-neutral min-h-10 h-10 btn-block">Cancel</button>
                    </form>
                    <div className="w-full">
                        <SubmitButton label="Delete" style="btn-error btn-block" onClick={deleteGraph} />
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
