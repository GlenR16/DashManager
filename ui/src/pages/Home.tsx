import { NavLink } from "react-router-dom";
import { UserContextType, useUser } from "../contexts/UserContext";

export default function Home(): React.ReactElement {
    const { user }: { user: UserContextType } = useUser();

    return (
        <section className="bg-base-100 h-full">
            <div className="h-full grid max-w-screen-xl px-8 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 gap-4">
                <div className="mt-0 col-span-12 lg:col-span-5 flex items-center justify-center">
                    <svg
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 512 512"
                        xmlSpace="preserve"
                        className="fill-secondary w-64 h-64"
                    >
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                            {" "}
                            <g>
                                {" "}
                                <polygon
                                    className="fill-primary"
                                    points="0.32,161.92 0,128.24 174.8,29.36 320,126.16 466.08,37.44 483.92,59.44 321.68,161.28 173.44,62.48 "
                                />{" "}
                                <polygon
                                    className="fill-primary"
                                    points="450.321,27.44 512,22 485.921,78.16 "
                                />{" "}
                            </g>{" "}
                            <polygon points="136.8,489.52 86.16,489.52 86.16,146.56 136.8,119.76 " />{" "}
                            <g>
                                {" "}
                                <polygon
                                    className="fill-primary"
                                    points="52.48,489.52 1.84,489.52 1.84,194.08 52.48,169.04 "
                                />{" "}
                                <polygon
                                    className="fill-primary"
                                    points="221.121,489.52 170.48,489.52 170.48,99.04 220.72,134.88 "
                                />{" "}
                            </g>{" "}
                            <polygon points="305.44,489.52 254.8,489.52 254.8,154.96 305.44,188.72 " />{" "}
                            <polygon
                                className="fill-primary"
                                points="389.76,488.72 338.881,488.72 338.56,185.761 389.76,158.08 "
                            />{" "}
                            <polygon points="474.081,490 423.52,490 423.52,134.32 474.081,103.12 " />{" "}
                        </g>
                    </svg>

                </div>
                <div className="place-self-center col-span-12 lg:col-span-7 flex flex-col gap-2 ">
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">Dash Manager</h1>
                    <p className="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl">Dash Manager is a tool to manage dashboards and graphs for your team. It is built using React, TypeScript, and Tailwind CSS.
                        We also provide data ingestion and transformation services for your data and error tracing for your applications.</p>
                    {
                        user && user.email ?
                            <NavLink to="/dashboard" className="btn btn-primary min-h-10 h-10">
                                Go to your Dashboard
                            </NavLink>
                            :
                            <NavLink to="/login" className="btn btn-primary min-h-10 h-10">
                                Get Started
                            </NavLink>
                    }
                </div>

            </div>
        </section>
    )
}
