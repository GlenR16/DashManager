import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import SubmitButton from "./SubmitButton";
import useAxiosAuth from "../utils/ApiProvider";
import { AxiosInstance } from "axios";

interface DeletePageModalProps {
    deletePageId: number;
    deletePageName: string;
    refreshData: () => Promise<void>;
}

export default function DeletePageModal({ deletePageId, deletePageName, refreshData }: DeletePageModalProps): React.ReactElement {
    const axios: AxiosInstance = useAxiosAuth();

    async function deletePage() {
        return axios.delete("/page/" + deletePageId)
            .then(() => {
                refreshData();
                (document.getElementById("deletePageModal") as any)?.close();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <dialog id="deletePageModal" className="modal">
            <div className="modal-box bg-base-200">
                <div className="sm:flex sm:items-start">
                    <ExclamationCircleIcon className="h-24 w-24 text-error" />
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-xl font-semibold leading-6" id="modal-title">
                            Delete page `{deletePageName}`
                        </h3>
                        <div className="mt-2">
                            <p className="">
                                Are you sure you want to
                                <span className="font-semibold text-error"> delete </span>
                                this page ? This action cannot be undone. All graphs and graph data will also be deleted from the database and cannot be recovered.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog" className="w-full">
                        <button className="btn btn-neutral min-h-10 h-10 btn-block">Cancel</button>
                    </form>
                    <div className="w-full">
                        <SubmitButton label="Delete" style="btn-error btn-block" onClick={deletePage} />
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
