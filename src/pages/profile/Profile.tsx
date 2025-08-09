import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { SearchIcon } from "~/components/icons/search";
import { WrapIcon } from "~/components/wrapIcon";
import { useUserStore } from "~/store/useUserStore";

export function ProfilePage() {
  const { user } = useUserStore();

  return (
    <div className="">
      <div className="px-3 flex justify-between">
        <div>
          <WrapIcon>
            <ArrowLeftIcon />
          </WrapIcon>
        </div>

        <WrapIcon>
          <SearchIcon />
        </WrapIcon>
      </div>
    </div>
  );
}
