import { JoinedCard } from "./JoinedCard";

export function JoinedTab() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <JoinedCard />
      <JoinedCard />
      <JoinedCard />
      <JoinedCard />
    </div>
  );
}
