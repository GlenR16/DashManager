import { useState } from "react";

interface SubmitButtonProps {
    label: string;
    icon?: React.ReactElement;
    onClick: () => Promise<any>;
    style?: string;
}

export default function SubmitButton({ label, icon, onClick, style = "btn-primary" }: SubmitButtonProps): React.ReactElement {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        await onClick();
        setLoading(false);
    }

    return (
        <button type="button" onClick={handleClick} className={`btn min-h-10 h-10 ${style} `} disabled={loading}>
            {
                loading ?
                    <span className="loading loading-dots loading-md"></span>
                    :
                    <>
                        {icon}
                        {label}
                    </>
            }
        </button>
    );
}