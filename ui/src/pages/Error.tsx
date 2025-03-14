import { useRouteError } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserProvider } from "../contexts/UserContext";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface ErrorProps {
    message?: string;
}

export default function Error({ message }: ErrorProps): React.ReactElement {
    const error: any = useRouteError();
    return (
        <UserProvider>
            {
                !message && <Navbar />
            }
            <div className="grow h-full w-full flex flex-col items-center justify-center gap-4">
                <div className="text-7xl font-semibold">
                    { error && error.status ? error.status : "" }
                </div>
                <div className="text-2xl font-semibold flex flex-row gap-4 items-center">
                    <ExclamationTriangleIcon className="w-10 h-10 text-error" />
                    { error && error.statusText ? error.statusText : message }
                </div>
                <div className="text-lg">
                    { error && error.statusText ? "Sorry, something went wrong. Our engineers are working on it.":"" }
                </div>
            </div>
        </UserProvider>
    )
}
