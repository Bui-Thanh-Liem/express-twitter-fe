import { Logo } from "./logo";

export function Loading() {
  return (
    <div className="bg-black fixed inset-0 flex justify-center items-center z-50">
      <Logo size={80} className="text-white" />
    </div>
  );
}
