export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  hint,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`px-4 py-3 bg-[#f3f3f5] rounded-xl outline-none border transition-colors ${
          error ? 'border-danger focus:border-danger' : 'border-transparent focus:border-blue-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}
