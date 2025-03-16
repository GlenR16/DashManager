import { NavigateFunction, NavLink, useNavigate } from "react-router-dom";
import { UserContextType, useUser } from "../contexts/UserContext";
import { HomeIcon, PresentationChartLineIcon } from "@heroicons/react/24/solid";

export default function Navbar(): React.ReactElement {
    const { user, clearUser }: { user : UserContextType | null, clearUser: () => Promise<void>} = useUser();
    const navigate: NavigateFunction = useNavigate();

    async function logout() {
        await clearUser();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
        window.location.reload();
    }

    return (
        <div className="navbar bg-base-100 shadow-sm h-13 min-h-13 border-b-2 border-primary">
            <div className="navbar-start gap-4">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-soft lg:hidden min-h-8 h-8 px-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content bg-base-300 rounded-box z-1 mt-4 w-52 p-2 shadow gap-1">
                        <li>
                            <NavLink to="/" className={({ isActive }) => isActive ? "bg-primary menu-disabled text-primary-content" : ""}>
                                <HomeIcon className="w-4 h-4" />
                                Home
                            </NavLink>
                        </li>
                        {
                            user && user.email ?
                            <li>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "bg-primary menu-disabled text-primary-content" : ""}>
                                    <PresentationChartLineIcon className="w-4 h-4" />
                                    Dashboard
                                </NavLink>
                            </li>
                            :
                            <></>
                        }
                    </ul>
                </div>
                <div className="inline-flex flex-row gap-2 items-center justify-center">
                    <a href="/" className="link no-underline text-lg">Dash Manager</a>
                    <ul className="menu menu-horizontal px-1 gap-1 hidden lg:flex">
                        <li>
                            <NavLink to="/" className={({ isActive }) => isActive ? "bg-primary min-h-8 h-8 menu-disabled text-primary-content" : "min-h-8 h-8"}>
                                Home
                                <HomeIcon className="w-4 h-4" />
                            </NavLink>
                        </li>
                        {
                            user && user.email ?
                            <li>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "bg-primary min-h-8 h-8 menu-disabled text-primary-content" : "min-h-8 h-8"}>
                                    Dashboard
                                    <PresentationChartLineIcon className="w-4 h-4" />
                                </NavLink>
                            </li>
                            :
                            <></>
                        }
                    </ul>
                </div>
            </div>
            <div className="navbar-end">
                {
                    user && user.email ?
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-primary w-9 h-9">
                                <div className="w-9 bg-base-100 rounded-full pt-[0.44rem] ">
                                    {
                                        user && user.name && 
                                        user.name.split(" ")[0][0].toUpperCase() + user.name.split(" ")[1][0].toUpperCase()               
                                    }
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu dropdown-content bg-base-300 rounded-box z-1 mt-4 w-52 p-2 shadow gap-1">
                                <li>
                                    <NavLink to="/profile" className={({ isActive }) => isActive ? "justify-between bg-primary menu-disabled text-primary-content" : "justify-between"}>
                                        Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <button onClick={logout} className="justify-between" >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                        :
                        <NavLink to="/login" className={({ isActive }) => isActive ? "btn btn-primary min-h-8 h-8" : "btn btn-dash btn-primary min-h-8 h-8"} >Login</NavLink>
                }
            </div>
        </div>
    )
}
