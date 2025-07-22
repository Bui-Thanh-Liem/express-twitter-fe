import { Logo } from "./logo";

export function Loading() {
  return (
    <div className="bg-black h-screen w-screen flex justify-center items-center">
      <Logo size={80} className="text-white" />
    </div>
  );
}
