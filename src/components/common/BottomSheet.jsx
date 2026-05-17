export default function BottomSheet({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl shadow-xl overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-center py-3 pb-1">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        
        {title && (
          <div className="px-6 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 text-center">{title}</h3>
          </div>
        )}
        
        <div className="px-6 py-6 pb-safe">
          {children}
        </div>
      </div>
    </div>
  );
}
