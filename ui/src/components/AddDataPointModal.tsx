import { useState } from "react";
import EditorField from "./EditorField";
import SubmitButton from "./SubmitButton";
import useAxiosAuth from "../utils/ApiProvider";
import { AxiosInstance } from "axios";

interface AddDataPointModalProps {
    data_array_id: number;
    refreshData: () => Promise<any>;
}

export default function AddDataPointModal({ data_array_id, refreshData }: AddDataPointModalProps): React.ReactElement {
    const axios: AxiosInstance = useAxiosAuth();

    const [dataPointForm, setDataPointForm] = useState<any>({
        object: {}
    });

    const [dataPointFormErrors, setDataPointFormErrors] = useState<any>({
        object: ""
    });

    function handleGraphEditorChange(value: string | undefined, _: any, name: string) {
        try {
            const parsedValue = JSON.parse(value || "{}");
            setDataPointForm({
                ...dataPointForm,
                [name]: parsedValue
            });
            setDataPointFormErrors({
                ...dataPointFormErrors,
                [name]: ""
            });
        } catch (error) {
            setDataPointFormErrors({
                ...dataPointFormErrors,
                [name]: "Invalid JSON"
            });
        }
    }

    async function addDataPoint() {
        return axios.post("/data_point", {
                ...dataPointForm,
                data_array: data_array_id
            })
            .then(async () => {
                await refreshData();
                (document.getElementById("addDataPointModal") as any)?.close()
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <dialog id="addDataPointModal" className="modal">
            <div className="modal-box bg-base-200">
                <div className="flex flex-col gap-2">
                    <div className="text-lg">
                        Add Data Point to Data Array {data_array_id}
                    </div>
                    <EditorField label="Object" language="json" name="object" value={dataPointForm.object} onChange={handleGraphEditorChange} error={dataPointFormErrors.object} />
                </div>
                <div className="modal-action">
                    <form method="dialog" className="w-full">
                        <button className="btn btn-neutral min-h-10 h-10 btn-block">Cancel</button>
                    </form>
                    <div className="w-full">
                        <SubmitButton label="Create" style="btn-primary btn-block" onClick={addDataPoint} />
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
