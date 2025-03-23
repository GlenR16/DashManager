import { NavigateFunction, useNavigate } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import { UserContextType, useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { AxiosInstance } from "axios";
import useAxiosAuth from "../utils/ApiProvider";
import { ClockIcon, ExclamationCircleIcon, KeyIcon } from "@heroicons/react/24/solid";
import InputField from "../components/InputField";
import moment from "moment";

export default function Profile(): React.ReactElement {
    const { user, clearUser, updateUser }: { user: UserContextType, clearUser: () => Promise<void>, updateUser: (user: UserContextType) => Promise<void> } = useUser();
    const navigate: NavigateFunction = useNavigate();
    const axios: AxiosInstance = useAxiosAuth();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [userForm, setUserForm] = useState<any>({
        name: user.name,
    });
    const [userErrors, setUserErrors] = useState<any>({});

    const [passwordChangeForm, setPasswordChangeForm] = useState<any>({
        current_password: "",
        password: "",
        confirm_password: "",
    });
    const [passwordChangeErrors, setPasswordChangeErrors] = useState<any>({});
    const [passwordChangeStatus, setPasswordChangeStatus] = useState<string>("");

    function handlePasswordFormChange(event: any) {
        setPasswordChangeForm({
            ...passwordChangeForm,
            [event.target.name]: event.target.value,
        });
    }

    async function changePassword() {
        if (passwordChangeForm.new_password !== passwordChangeForm.confirm_password) {
            setPasswordChangeErrors({ detail: "New password and confirm password do not match!" });
            return;
        }
        return axios.put("/user", passwordChangeForm)
            .then(() => {
                setPasswordChangeStatus("Password changed successfully!");
            })
            .catch((error) => {
                setPasswordChangeErrors(error.response.data);
            });
    }

    function handleUserFormChange(event: any) {
        setUserForm({
            ...userForm,
            [event.target.name]: event.target.value,
        });
    }

    useEffect(() => {
        axios
            .get("/user").then((response) => {
                updateUser(response.data);
            });
    }, []);

    async function logout() {
        await clearUser();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/");
    }

    async function submitUpdateUser() {
        return axios.put("/user", userForm)
            .then((response) => {
                updateUser(response.data);
                setEditMode(false);
            })
            .catch((error) => {
                setUserErrors(error.response.data);
            });
    }

    async function deleteUser() {
        return axios.delete("/user")
            .then(() => {
                clearUser();
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                navigate("/");
                window.location.reload();
            })
            .catch((error) => {
                setUserErrors(error.response.data);
            }
        );
    }

    return (
        <div className="grow w-full flex flex-col items-center p-4 gap-4">
            <div className="w-full max-w-screen-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <div className="card w-full bg-base-300 shadow-xl">
                        <div className="card-body gap-4">
                            <SubmitButton label="Logout from this device" style="btn-warning" onClick={logout} />
                            <div className="stats shadow bg-base-100">
                                <div className="stat col-span-6">
                                    <div className="stat-figure text-primary">
                                        <ClockIcon className="inline-block h-8 w-8" />
                                    </div>
                                    <div className="stat-title">Account Created</div>
                                    <div className="stat-desc text-lg">
                                        {moment(user.created_at).from(moment(new Date()))}
                                    </div>
                                </div>
                                <div className="stat col-span-4">
                                    <div className="stat-figure text-secondary">
                                        <KeyIcon className="inline-block h-8 w-8" />
                                    </div>
                                    <div className="stat-title">Last Login</div>
                                    <div className="stat-desc text-lg">
                                        {moment(user.last_login).from(moment(new Date()))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card w-full bg-base-300 shadow-xl">
                        <div className="card-body gap-4">
                        <h2 className="card-title justify-between">
								<span>Profile Details</span>
								<div className="form-control">
									<label className="label cursor-pointer gap-2">
										<span className="label-text">Edit</span>
										<input type="checkbox" className="toggle toggle-primary" checked={editMode} onChange={() => setEditMode((editMode) => !editMode)} />
									</label>
								</div>
							</h2>
							<div className="flex flex-col gap-4">
								<InputField name="name" label="Name" type="text" value={userForm.name} onChange={handleUserFormChange} placeholder="" error={userErrors.name} disabled={!editMode} />
								{editMode && userErrors?.detail && <p className="text-error text-sm text-center">{userErrors.detail}</p>}
								{editMode && (
									<>
										<SubmitButton label="Update" onClick={submitUpdateUser} />
                                        <SubmitButton label="Delete" style="btn-error" onClick={() => (document.getElementById("deleteUserModal") as any)?.showModal()} />
										<dialog id="deleteUserModal" className="modal">
											<div className="modal-box bg-base-200">
												<div className="sm:flex sm:items-start">
													<ExclamationCircleIcon className="h-24 w-24 text-error" />
													<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
														<h3 className="text-xl font-semibold leading-6" id="modal-title">
															Delete user profile
														</h3>
														<div className="mt-2">
															<p className="">
																Are you sure you want to
																<span className="font-semibold text-error"> delete </span>
																your account ? This action cannot be undone. All teams, graphs and graph data will also be deleted from the database and cannot be recovered.
															</p>
														</div>
													</div>
												</div>
												<div className="modal-action">
													<form method="dialog" className="w-full">
														<button className="btn btn-neutral min-h-10 h-10 btn-block">Cancel</button>
													</form>
													<div className="w-full">
														<SubmitButton label="Delete" style="btn-error btn-block" onClick={deleteUser} />
													</div>
												</div>
											</div>
											<form method="dialog" className="modal-backdrop">
												<button>close</button>
											</form>
										</dialog>
									</>
								)}
							</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="card w-full max-w-screen-xl bg-base-300 shadow-xl">
                        <div className="card-body gap-4">
                            <h2 className="card-title justify-between">
                                <span>Update Password Details</span>
                            </h2>
                            <div className="flex flex-col gap-4">
								<InputField name="current_password" label="Current Password" type="password" value={passwordChangeForm.current_password} onChange={handlePasswordFormChange} placeholder="" error={passwordChangeErrors.current_password} />
								<InputField name="new_password" label="New Password" type="password" value={passwordChangeForm.new_password} onChange={handlePasswordFormChange} placeholder="" error={passwordChangeErrors.new_password} />
								<InputField name="confirm_password" label="Confirm Password" type="password" value={passwordChangeForm.confirm_password} onChange={handlePasswordFormChange} placeholder="" error={passwordChangeErrors.confirm_password} />
								{passwordChangeErrors?.detail && <p className="text-error text-sm text-center">{passwordChangeErrors.detail}</p>}
								{passwordChangeStatus && <p className="text-success text-sm text-center">{passwordChangeStatus}</p>}
								<SubmitButton label="Change Password" onClick={changePassword} />
							</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
