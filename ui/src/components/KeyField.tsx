import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosAuth from "../utils/ApiProvider";
import { AxiosInstance } from "axios";
import { ArrowPathIcon, ClipboardDocumentCheckIcon, ClipboardDocumentIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

interface KeyFieldProps {
    secretKey: string;
    refreshTeamData: () => Promise<void>;
}

export default function KeyField({ secretKey, refreshTeamData }: KeyFieldProps): React.ReactElement {
	const [show, setShow] = useState(false);
	const [copied, setCopied] = useState(false);
	const [apikey, setApikey] = useState(secretKey);
	const teamId = useParams().id;
	const axios: AxiosInstance = useAxiosAuth();

	function copyToClipboard() {
		navigator.clipboard.writeText("Use this invite code to join my team on Dash Manager: " + secretKey);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 2000);
	}

	function resetKey() {
		axios
			.post(`/team/key/functions`, { id: teamId })
			.then((_) => {
                axios.get(`/team/${teamId}`)
                    .then((response) => {
                        refreshTeamData();
                        setApikey(response.data.invite_code);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
			})
			.catch((_) => {
				console.error("Error resetting team invite code");
			});
	}

	useEffect(() => {
		if (show) {
			setApikey(secretKey);
		} else {
			setApikey("●●●●●●●●");
		}
	}, [show]);

	return (
		<div className="flex flex-col md:flex-row gap-4 w-full items-end">
			<div className="w-full flex flex-col">
				<div className="label pt-0">
					<span className="label-text-alt">Team Invite Code</span>
				</div>
                <div className="join">
                    <span className="btn btn-primary btn-outline rounded-l-md" onClick={() => setShow((show) => !show)}>
                        {show ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </span>
                    <label className="input input-bordered focus:outline-none focus-within:outline-none flex items-center gap-2 px-2 w-full">
                        <input type="text" name="api_key" autoComplete="off" className="grow overflow-hidden w-5 text-center" value={apikey} readOnly />
                    </label>
                    <span className="btn btn-primary btn-outline rounded-r-md" onClick={copyToClipboard}>
                        {copied ? (
                            <ClipboardDocumentCheckIcon className="h-5 w-5" />
                        ) : (
                            <ClipboardDocumentIcon className="h-5 w-5" />
                        )}
                    </span>
                </div>
			</div>
            <button type="button" className="btn btn-warning btn-outline btn-block md:w-auto" onClick={resetKey}>
                Reset
                <ArrowPathIcon className="h-5 w-5" />
            </button>
		</div>
	);
}