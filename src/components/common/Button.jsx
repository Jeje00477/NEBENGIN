import { Loader2 } from "lucide-react";

export default function Button({
  label,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
  type = 'button'
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all rounded-xl active:scale-95 text-base py-3 px-4";
  const widthStyles = fullWidth ? "w-full" : "";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outlined: "border-2 border-gray-200 text-gray-800 hover:border-gray-300",
    danger: "bg-danger text-white hover:bg-danger/90",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  const currentVariant = variants[variant] || variants.primary;
  const disabledStyles = disabled || loading ? "opacity-60 cursor-not-allowed active:scale-100" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${widthStyles} ${currentVariant} ${disabledStyles} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        label
      )}
    </button>
  );
}
