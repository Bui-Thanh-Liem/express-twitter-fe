// components/ui/divider.tsx
interface DividerProps {
  text?: string;
  className?: string;
}

export function Divider({ text = "HOẶC", className = "" }: DividerProps) {
  return (
    <div className={`flex items-center my-4 ${className}`}>
      <div className="flex-grow h-px bg-gray-200" />
      <span className="px-3 text-sm text-gray-600 font-medium">{text}</span>
      <div className="flex-grow h-px bg-gray-200" />
    </div>
  );
}
