import { Editor } from "@monaco-editor/react";

interface EditorFieldProps {
    label: string;
    error: string;
    language: string;
    value: any;
    name: string
    onChange: (value: string | undefined, event: any, name: string) => void;
}

export default function EditorField({label, error, language, value,name , onChange}: EditorFieldProps): React.ReactElement {
    const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "vs-dark" : "vs-light";
    return (
        <label className="form-control w-full">
            <div className="label pt-0">
                <span className="label-text-alt">{label}</span>
            </div>
            <Editor className={`h-64 input border-2 focus:outline-none focus-within:outline-none p-0 ${error?"input-error":""}`} theme={theme} language={language} defaultValue={JSON.stringify(value,null,4)} onChange={(value, event) => onChange(value, event, name)}  />
            <div className="label pb-0">
                <span className="label-text-alt text-error">
                    {error ? (error) : ""}
                </span>
            </div>
        </label>
    )
}
