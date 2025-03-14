import { createContext,useContext,useCallback,useMemo,useState } from "react";
import { DataStore } from "../utils/StorageProvider";

var dbUser: UserContextType | null = await DataStore.getItem("user") || null;

export interface UserContextType {
    id: number;
    email: string;
    name: string;
    is_staff: boolean;
    is_active: boolean;
    last_login: string;
    created_at: string;
    updated_at: string;
}
    
const UserContext: React.Context<UserContextType | null> = createContext(dbUser);

export function useUser(): any {
    const user = useContext(UserContext);
    return user;
}

interface ProviderProps {
    children: React.ReactNode;
}

export function UserProvider({ children }: ProviderProps ): React.ReactElement {
    const [ user, setUser ] = useState(dbUser);

    const updateUser: (user: UserContextType) => void = useCallback((user: UserContextType) => {
        if (!user || !user.email || !user.name) {
            throw Error("Important details cannot be empty!")
        }
        setUser(user);
        DataStore.setItem("user", user);
    }, []);

    const clearUser:() => void  = useCallback(() => {
        setUser(null);
        DataStore.removeItem("user");
    }, []);

    const value: any = useMemo(
        () => ({ user, updateUser, clearUser }),
        [ user, updateUser, clearUser ]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}