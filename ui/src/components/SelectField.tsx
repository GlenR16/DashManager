interface SelectFieldProps {
    name: string;
    label: string;
    error: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled: boolean;
    children: React.ReactNode;
}

export default function SelectField({ name, label, error, value, onChange, disabled, children }: SelectFieldProps): React.ReactElement {
	return (
        <>
        <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-base font-medium">{label}</legend>
            <select className={`select select-bordered w-full focus:outline-none focus-within:outline-none ${error?"input-error":""} `} name={name} value={value} onChange={onChange} disabled={disabled} >
                { children }
            </select>
            <div className="label pb-0">
                <span className="label-text-alt text-error">
                    {error && (error)}
                </span>
            </div>
      </fieldset>
      </>
	);
}