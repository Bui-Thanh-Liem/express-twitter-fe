import {
  ChevronLeft,
  ChevronRight,
  CircleQuestionMark,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShortInfoProfile } from "~/components/ShortInfoProfile";
import { AvatarMain } from "~/components/ui/avatar";
import { DialogMain } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { SearchMain } from "~/components/ui/search";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { WrapIcon } from "~/components/wrapIcon";
import { useDebounce } from "~/hooks/useDebounce";
import {
  useChangeMemberShip,
  useChangeVisibility,
  useDemoteMentor,
  useGetMMCommunityById,
  usePromoteMentor,
} from "~/hooks/useFetchCommunity";
import { cn } from "~/lib/utils";
import { CONSTANT_MAX_LENGTH_MENTOR } from "~/shared/constants";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { handleResponse } from "~/utils/handleResponse";
import { toastSimple } from "~/utils/toastSimple.util";
import { infoMap } from "./CommunityInfo";

export function CommunitySetting({ community }: { community: ICommunity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<IUser[]>([]);
  const [mentors, setMentors] = useState<IUser[]>([]);

  // Search
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 500);

  //
  const apiPromote = usePromoteMentor();
  const apiDemote = useDemoteMentor();
  const apiChangeMembershipType = useChangeMemberShip();
  const apiChangeVisibilityType = useChangeVisibility();
  const { data } = useGetMMCommunityById(
    community._id!,
    { page: "1", limit: "20", q: debouncedSearchVal },
    isOpen
  );
  const communityDetail = data?.data;

  //
  useEffect(() => {
    setMembers(communityDetail?.members || []);
    setMentors(communityDetail?.mentors || []);
  }, [communityDetail]);

  //
  if (!community.isAdmin) return null;

  //
  async function handlePromoteMentor(user: IUser) {
    // 1. Backup state hiện tại
    const prevMembers = members;
    const prevMentors = mentors;

    // 2. Optimistic update - cập nhật UI ngay
    setMembers((prev) => prev.filter((u) => u._id !== user._id));
    setMentors((prev) => [user, ...prev]);

    try {
      // 3. Call API
      const res = await apiPromote.mutateAsync({
        user_id: user._id,
        community_id: community._id,
      });

      // 4. Nếu thất bại → rollback
      if (res.statusCode !== 200 && res.statusCode !== 201) {
        setMembers(prevMembers);
        setMentors(prevMentors);
        handleResponse(res);
      }
    } catch (error) {
      // 5. Rollback khi có lỗi
      setMembers(prevMembers);
      setMentors(prevMentors);
      toastSimple((error as { message: string }).message, "error");
    }
  }

  //
  async function handleDemoteMentor(user: IUser) {
    // 1. Backup state hiện tại
    const prevMembers = members;
    const prevMentors = mentors;

    // 2. Optimistic update - cập nhật UI ngay
    setMentors((prev) => prev.filter((u) => u._id !== user._id));
    setMembers((prev) => [user, ...prev]);

    try {
      // 3. Call API
      const res = await apiDemote.mutateAsync({
        user_id: user._id,
        community_id: community._id,
      });

      // 4. Nếu thất bại → rollback
      if (res.statusCode !== 200 && res.statusCode !== 201) {
        setMembers(prevMembers);
        setMentors(prevMentors);
        handleResponse(res);
      }
    } catch (error) {
      // 5. Rollback khi có lỗi
      setMembers(prevMembers);
      setMentors(prevMentors);
      toastSimple((error as { message: string }).message, "error");
    }
  }

  async function handleChangeMembership(type: EMembershipType | string) {
    const res = await apiChangeMembershipType.mutateAsync({
      community_id: community._id,
      membershipType: type as EMembershipType,
    });
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      toastSimple(res.message, "error");
    }
  }

  async function handleChangeVisibility(type: EVisibilityType | string) {
    const res = await apiChangeVisibilityType.mutateAsync({
      community_id: community._id,
      visibilityType: type as EVisibilityType,
    });
    if (res.statusCode !== 200 && res.statusCode !== 201) {
      toastSimple(res.message, "error");
    }
  }

  return (
    <>
      <WrapIcon className="border" onClick={() => setIsOpen(true)}>
        <Settings size={18} />
      </WrapIcon>

      <DialogMain
        width="5xl"
        open={isOpen}
        isLogo={false}
        textHeader="Cài đặt"
        textDesc={`Những thay đổi này chỉ ảnh hưởng trong cộng đồng ${community.name}`}
        onOpenChange={setIsOpen}
      >
        <div className="grid grid-cols-3 gap-x-4 mt-6">
          {/*  */}
          <div className="p-3 rounded-2xl border shadow">
            <p className="mb-2 font-medium">Cài đặt hiển thị</p>
            <div className="ml-4">
              <RadioGroupSetting
                options={Object.values(EMembershipType)}
                value={community.membershipType}
                onValueChange={handleChangeMembership}
              />
            </div>
            <p className="mb-2 font-medium mt-3">Cài đặt tham gia</p>
            <div className="ml-4">
              <RadioGroupSetting
                value={community.visibilityType}
                onValueChange={handleChangeVisibility}
                options={Object.values(EVisibilityType)}
              />
            </div>
          </div>

          {/*  */}
          <div className="p-3 rounded-2xl border shadow">
            <div className="mb-3">
              <p className="mb-2 font-medium">Thành viên</p>
              <SearchMain
                size="sm"
                value={searchVal}
                onChange={setSearchVal}
                onClear={() => setSearchVal("")}
              />
            </div>

            <div className="max-h-[350px] overflow-auto">
              {members.length === 0 && (
                <div className="mt-[86px]">
                  <p className="text-sm text-gray-400 text-center">
                    Chưa có thành viên
                  </p>
                </div>
              )}
              {members?.map((user) => (
                <MemberItem
                  key={user._id}
                  user={user}
                  onClick={() => {
                    handlePromoteMentor(user);
                  }}
                  disable={mentors.length >= CONSTANT_MAX_LENGTH_MENTOR}
                />
              ))}
            </div>
          </div>

          {/*  */}
          <div className="p-3 rounded-2xl border shadow">
            <p className="mb-2 font-medium">
              Điều hành viên{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="mr-2">
                    <CircleQuestionMark size={16} color="#99a1af" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Được mời người dùng khác tham gia</p>
                  <p className="text-sm">Được duyệt nội dung trong cộng đồng</p>
                </TooltipContent>
              </Tooltip>
              <span className="font-thin">
                {mentors?.length}/ {CONSTANT_MAX_LENGTH_MENTOR}
              </span>
            </p>

            <div className="max-h-[400px] overflow-auto">
              {mentors.length === 0 && (
                <div className="mt-32">
                  <p className="text-sm text-gray-400 text-center">
                    {`Chưa có điều hành viên, hãy cho những người
                    bạn tin tưởng cùng quản lý cộng đồng ${community.name}.`}
                  </p>
                </div>
              )}
              {mentors?.map((user) => (
                <MentorItem
                  key={user._id}
                  user={user}
                  onClick={() => {
                    handleDemoteMentor(user);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogMain>
    </>
  );
}

function MemberItem({
  user,
  disable,
  onClick,
}: {
  user: IUser;
  disable?: boolean;
  onClick: () => void;
}) {
  return (
    <Label
      htmlFor={user._id}
      className="flex items-center gap-3 hover:bg-gray-100 py-1 px-2 rounded-sm cursor-pointer group"
    >
      <AvatarMain src={user.avatar} alt={user.name} className="w-10 h-10" />
      <ShortInfoProfile profile={user as IUser} className="inline-block">
        <Link to={`/${user?.username}`} className="flex items-center gap-2">
          <p className="text-sm max-w-28 line-clamp-1 leading-snug font-semibold flex items-center gap-1 hover:underline hover:cursor-pointer">
            {user.name}
          </p>
        </Link>
      </ShortInfoProfile>
      {!disable && (
        <WrapIcon
          className="ml-auto p-1.5 hidden group-hover:block"
          onClick={onClick}
        >
          <ChevronRight color="#666" />
        </WrapIcon>
      )}
    </Label>
  );
}

function MentorItem({ user, onClick }: { user: IUser; onClick: () => void }) {
  return (
    <Label
      htmlFor={user._id}
      className="flex items-center gap-3 hover:bg-gray-100 py-1 px-2 rounded-sm cursor-pointer"
    >
      <WrapIcon className="p-1.5" onClick={onClick}>
        <ChevronLeft color="#666" />
      </WrapIcon>
      <AvatarMain src={user.avatar} alt={user.name} className="w-10 h-10" />
      <ShortInfoProfile profile={user as IUser} className="inline-block">
        <Link to={`/${user?.username}`} className="flex items-center gap-2">
          <p className="text-sm max-w-28 line-clamp-1 leading-snug font-semibold flex items-center gap-1 hover:underline hover:cursor-pointer">
            {user.name}
          </p>
        </Link>
      </ShortInfoProfile>
    </Label>
  );
}

export function RadioGroupSetting({
  value,
  options,
  onValueChange,
}: {
  onValueChange: (val: string) => void;
  value: EMembershipType | EVisibilityType;
  options: EMembershipType[] | EVisibilityType[];
}) {
  return (
    <RadioGroup
      defaultValue={value}
      className="flex flex-col gap-3"
      onValueChange={onValueChange}
    >
      {options.map((item) => (
        <label
          htmlFor={item}
          className={cn(
            "border border-gray-100 rounded-lg p-2 px-3 cursor-pointer transition-all",
            "hover:border-primary/10 hover:shadow",
            "flex flex-col gap-1",
            "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5"
          )}
        >
          <div className="flex items-start gap-3">
            <RadioGroupItem value={item} id={item} className="mt-1.5" />
            <div>
              <div>{item}</div>
              <p className="text-sm text-muted-foreground">{infoMap[item]}</p>
            </div>
          </div>
        </label>
      ))}
    </RadioGroup>
  );
}
