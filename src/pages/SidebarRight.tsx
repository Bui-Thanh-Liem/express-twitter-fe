import { useState } from "react";
import { SearchMain } from "~/components/ui/search";

export function SidebarRight() {
  const [searchVal, setSearchVal] = useState("");
  
  return (
    <div>
      <div className="px-4 pt-2 flex items-center gap-3">
        <SearchMain
          size="lg"
          // suggestions={[
          //   { id: "1", label: "liem 1" },
          //   { id: "1", label: "liem 2" },
          // ]}
          value={searchVal}
          onClear={() => setSearchVal("")}
          onChange={setSearchVal}
        />
      </div>
    </div>
  );
}
