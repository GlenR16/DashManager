import { AxiosInstance } from "axios";
import { NavigateFunction, useNavigate, useOutletContext, useParams } from "react-router-dom";
import useAxiosAuth from "../utils/ApiProvider";
import { useEffect, useState } from "react";
import Page from "../models/Page";
import SubmitButton from "../components/SubmitButton";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import EditorField from "../components/EditorField";

export default function CreateGraph(): React.ReactElement {
    const pageId = useParams().pageId as string;
    const axios: AxiosInstance = useAxiosAuth();
    const navigate: NavigateFunction = useNavigate();
    const { refreshBaseData } = useOutletContext() as { refreshBaseData: () => Promise<any> };

    const [page, setPage] = useState<Page | null>(null);
    const [graphForm, setGraphForm] = useState<any>({
        title: "",
        description: "",
        page: pageId,
        is_enabled: true,
        type: "LINE_CHART",
        size: "NORMAL",
        order: 0,
        meta: {}
    });
    const [graphFormErrors, setGraphFormErrors] = useState<any>({
        title: "",
        description: ""
    });
    const [graphTypeOptions, setGraphTypeOptions] = useState<string[][]>([]);
    const [graphSizeOptions, setGraphSizeOptions] = useState<string[][]>([]);

    async function refreshData() {
        return axios.get("/page/" + pageId)
            .then(async (response) => {
                setPage(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        refreshData();
        axios.get("/meta/graph/types")
            .then((response) => {
                setGraphTypeOptions(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
        axios.get("/meta/graph/sizes")
            .then((response) => {
                setGraphSizeOptions(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    function handleGraphFormChange(event: React.ChangeEvent<HTMLInputElement>) {
        setGraphForm({ ...graphForm, [event.target.name]: event.target.value });
    }

    function handleGraphSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setGraphForm({ ...graphForm, [event.target.name]: event.target.value });
    }

    function handleGraphEditorChange(value: string | undefined, _: any, name: string) {
        try {
            const parsedValue = JSON.parse(value || "{}");
            setGraphForm({
                ...graphForm,
                [name]: parsedValue
            });
            setGraphFormErrors({
                ...graphFormErrors,
                [name]: ""
            });
        } catch (error) {
            setGraphFormErrors({
                ...graphFormErrors,
                [name]: "Invalid JSON"
            });
        }
    }

    function handleGraphCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setGraphForm({ ...graphForm, [event.target.name]: event.target.checked });
    }

    async function submitCreateGraph() {
        return axios.post("/graph", { ...graphForm, page: pageId })
            .then((_) => {
                refreshBaseData();
                navigate("/team/" + page?.team);
            })
            .catch((error) => {
                setGraphFormErrors({ ...error.response.data });
            });
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 flex flex-col gap-4">
                <div className="text-2xl font-semibold text-center">
                    Create Graph
                </div>
                <div className="pb-4">
                    <div className="card bg-base-300 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">Graph Details</h2>
                            <div className="flex flex-col gap-4">
                                <InputField label="Title" name="title" placeholder="" type="text" value={graphForm.title} onChange={handleGraphFormChange} error={graphFormErrors.title} />
                                <InputField label="Description" name="description" placeholder="" type="text" value={graphForm.description} onChange={handleGraphFormChange} error={graphFormErrors.description} />
                                <div className='flex flex-col md:flex-row gap-4 items-center'>
                                    <div className='flex flex-row gap-4 items-center w-full'>
                                        <input type="checkbox" name="is_enabled" className="toggle" checked={graphForm.is_enabled} onChange={handleGraphCheckboxChange} />
                                        Is graph enabled ?
                                    </div>
                                    <InputField label='Order' name='order' type='number' placeholder='' value={graphForm.order} onChange={handleGraphFormChange} error={graphFormErrors.order} disabled={false} />
                                </div>
                                <div className='flex flex-col md:flex-row gap-4 items-center'>
                                    <SelectField label='Type' name='type' value={graphForm.type} onChange={handleGraphSelectChange} error={graphFormErrors.type} disabled={false}>
                                        {
                                            graphTypeOptions.map((option, index) => {
                                                return <option key={index} value={option[0]} >{option[1]}</option>
                                            })
                                        }
                                    </SelectField>
                                    <SelectField label='Size' name='size' value={graphForm.size} onChange={handleGraphSelectChange} error={graphFormErrors.size} disabled={false}>
                                        {
                                            graphSizeOptions.map((option, index) => {
                                                return <option key={index} value={option[0]} >{option[1]}</option>
                                            })
                                        }
                                    </SelectField>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 items-center">
                                    <EditorField label='Meta' language='json' name="meta" value={graphForm.meta} onChange={handleGraphEditorChange} error={graphFormErrors.meta} />
                                </div>
                            </div>
                            <div className="card-actions justify-end mt-2">
                                <SubmitButton label="Create Graph" onClick={submitCreateGraph} style="btn-primary btn-block" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
