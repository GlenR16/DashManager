import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserProvider } from "../contexts/UserContext";

export default function Root(): React.ReactElement {
  return (
    <UserProvider>
        <Navbar />
        <div className="grow overflow-y-auto">
            <Outlet />
        </div>
    </UserProvider>
  )
}
