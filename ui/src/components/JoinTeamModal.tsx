import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { useState } from "react";

interface JoinTeamModalProps {
    refreshData: () => Promise<void>;
}

export default function JoinTeamModal({ refreshData }: JoinTeamModalProps): React.ReactElement {
    const axios: AxiosInstance = useAxiosAuth();
    const [inviteCode, setInviteCode] = useState<string>("");
    const [error, setError] = useState({
        invite_code: "",
    });

    async function submitInviteCode() {
        return axios.post("/team/functions", {
            invite_code: inviteCode,
        })
        .then(() => {
            refreshData();
            (document.getElementById("joinTeamModal") as any)?.close();
        })
        .catch((error) => {
            setError(error.response.data);
        });
    }

    return (
        <dialog id="joinTeamModal" className="modal">
            <div className="modal-box bg-base-200">
                <div className="sm:flex sm:items-start">
                    <div className="w-full">
                        <h3 className="text-xl font-semibold leading-6" id="modal-title">
                            Join Team 
                        </h3>
                        <div className="mt-2 w-full">
                            <InputField name="invite_code" label="Invite Code" type="text" placeholder="" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} error={error.invite_code} />
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog" className="w-full">
                        <button className="btn btn-neutral min-h-10 h-10 btn-block">Cancel</button>
                    </form>
                    <div className="w-full">
                        <SubmitButton label="Join" style="btn-primary btn-block" onClick={submitInviteCode} />
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
