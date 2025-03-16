import SubmitButton from "../components/SubmitButton";
import { NavigateFunction, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useState } from "react";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import InputField from "../components/InputField";

export default function CreatePage(): React.ReactElement {
    const teamId = useParams().teamId as string;
    const axios: AxiosInstance = useAxiosAuth();
    const navigate: NavigateFunction = useNavigate();
    const { refreshBaseData } = useOutletContext() as { refreshBaseData: () => Promise<any> };

    const [pageForm, setPageForm] = useState<any>({
        title: "",
        description: "",
        team: teamId
    });
    const [pageFormErrors, setPageFormErrors] = useState<any>({
        title: "",
        description: ""
    });

    async function submitCreatePage() {
        return axios.post("/page", pageForm)
            .then(async (_) => {
                await refreshBaseData();
                navigate("/team/" + teamId);
            })
            .catch((error) => {
                setPageFormErrors({ ...error.response.data });
            });
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 flex flex-col gap-4">
                <div className="text-2xl font-semibold text-center">
                    Create Page
                </div>
                <div className="pb-4">
                    <div className="card bg-base-300 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">Page Details</h2>
                            <InputField name="title" placeholder="" label="Title" error={pageFormErrors.title} type="text" value={pageForm.title} onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })} />
                            <InputField name="description" placeholder="" label="Description" error={pageFormErrors.description} type="text" value={pageForm.description} onChange={(e) => setPageForm({ ...pageForm, description: e.target.value })} />
                            <div className="card-actions justify-end mt-2">
                                <SubmitButton label="Create Page" onClick={submitCreatePage} style="btn-primary btn-block" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
