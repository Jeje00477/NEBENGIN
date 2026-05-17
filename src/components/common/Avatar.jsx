export default function Avatar({ src, nama = '', size = 'md', className = '' }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-base",
    lg: "w-20 h-20 text-2xl",
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 font-semibold flex-shrink-0 ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={nama} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(nama)}</span>
      )}
    </div>
  );
}
