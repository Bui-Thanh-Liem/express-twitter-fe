import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { WrapIcon } from "~/components/wrapIcon";

export function CommunityPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Cộng đồng</p>
        </div>
      </div>
    </div>
  );
}
