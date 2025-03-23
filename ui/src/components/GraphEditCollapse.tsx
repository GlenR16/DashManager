import { useEffect, useState } from 'react';
import Graph from '../models/Graph'
import SelectField from './SelectField';
import { AxiosInstance } from 'axios';
import useAxiosAuth from '../utils/ApiProvider';
import InputField from './InputField';
import EditorField from './EditorField';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { NavLink, useParams } from 'react-router-dom';

interface GraphEditCollapseProps {
    graph: Graph;
    setDeleteGraphData: React.Dispatch<React.SetStateAction<{
        id: number;
        name: string;
    }>>;
    refreshData: () => Promise<any>;
}

export default function GraphEditCollapse({ graph, setDeleteGraphData, refreshData }: GraphEditCollapseProps): React.ReactElement {
    const axios: AxiosInstance = useAxiosAuth();
    const teamId: string = useParams().teamId as string;

    const [graphForm, setGraphForm] = useState({
        title: graph.title,
        description: graph.description,
        is_enabled: graph.is_enabled,
        type: graph.type,
        size: graph.size,
        order: graph.order,
        data_arrays: graph.data_arrays,
        meta: graph.meta
    });
    const [graphFormErrors, setGraphFormErrors] = useState({
        title: "",
        description: "",
        is_enabled: "",
        type: "",
        size: "",
        order: "",
        data_arrays: "",
        meta: ""
    });
    const [graphTypeOptions, setGraphTypeOptions] = useState<string[][]>([]);
    const [graphSizeOptions, setGraphSizeOptions] = useState<string[][]>([]);
    const [toastMessage, setToastMessage] = useState<string>("");

    useEffect(() => {
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

    function showGraphDeleteModal() {
        setDeleteGraphData({
            id: graph.id,
            name: graph.title
        });
        const modal = document.getElementById("deleteGraphModal") as any;
        modal.showModal();
    }

    function handleGraphFormChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setGraphForm({
            ...graphForm,
            [name]: value
        });
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

    function handleGraphSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target;
        setGraphForm({
            ...graphForm,
            [name]: value
        });
    }

    function handleGraphCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;
        setGraphForm({
            ...graphForm,
            [name]: checked
        });
    }

    async function submitGraphForm() {
        return axios.put("/graph/" + graph.id, graphForm)
            .then(async () => {
                setToastMessage("Graph updated successfully");
                await refreshData();
                setTimeout(() => {
                    setToastMessage("");
                }, 5000);
            })
            .catch((error) => {
                setGraphFormErrors(error.response.data);
            });
    }

    return (
        <div className="collapse collapse-arrow join-item border-primary border-2">
            {
                toastMessage &&
                <div className="toast toast-top toast-end">
                    <div className="alert alert-success">
                        <CheckCircleIcon className="w-6 h-6" />
                        <span>{toastMessage}</span>
                    </div>
                </div>
            }
            <input type="radio" name="graphItem" />
            <div className="collapse-title font-semibold inline-flex items-center">
                {graph.title}
            </div>
            <div className="collapse-content text-sm">
                {graph.description}
                <div className="flex flex-col gap-4 py-4">
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
                    <div className="flex flex-col items-center gap-1">
                        <div role="alert" className="alert w-full">
                            <InformationCircleIcon className="w-6 h-6" />
                            <span>
                                Meta field allows you to add additional information to the graph in JSON format. Current allowed fields include: "dataKeys": string[], "nameKeys": string[]
                            </span>
                        </div>
                        <EditorField label='Meta' name='meta' language='json' value={graphForm.meta} onChange={handleGraphEditorChange} error={graphFormErrors.meta} />
                    </div>
                </div>

                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2 items-center'>
                        <button className="btn btn-primary min-h-8 h-8" onClick={submitGraphForm}>
                            Save
                        </button>
                        <NavLink to={`/team/${teamId}/page/${graph.page}/graph/${graph.id}/edit`} className="btn btn-primary min-h-8 h-8">
                            Edit Graph Data
                        </NavLink>
                    </div>
                    <button className="btn btn-error min-h-8 h-8" onClick={showGraphDeleteModal}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
