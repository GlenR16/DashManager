interface TextAreaFieldProps {
    name: string;
    placeholder: string;
    label: string;
    error: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
}

export default function TextAreaField({ name, placeholder, label, error, value, onChange, disabled = false }: TextAreaFieldProps): React.ReactElement {
	return (
		<label className="form-control w-full">
			<div className="label pt-0">
				<span className="label-text-alt">{label}</span>
			</div>
			<textarea name={name} autoComplete="off" className={`input input-bordered p-2 min-h-20 w-full focus:outline-none focus-within:outline-none ${error?"input-error":""} `} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} />
			<div className="label pb-0">
                <span className="label-text-alt text-error">
                    {error ? (error) : ""}     
                </span>
            </div>
		</label>
	);
}