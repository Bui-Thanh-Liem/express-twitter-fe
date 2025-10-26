import { Calendar } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { VerifyIcon } from "~/components/icons/verify";
import { ButtonMain } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetOneCommunityBySlug } from "~/hooks/useFetchCommunity";
import { ETweetType } from "~/shared/enums/type.enum";
import { formatDateToDateVN } from "~/utils/formatDateToDateVN";
import { ProfileSkeleton } from "../../profile/ProfilePage";
import { CommunityInfo } from "./CommunityInfo";
import { CommunityInvite } from "./CommunityInvite";
import { CommunityJoinLeave } from "./CommunityJoinLeave";
import { CommunitySetting } from "./CommunitySetting";

export function CommunityPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  //
  const { data, refetch, isLoading, error } = useGetOneCommunityBySlug(slug!);
  const community = data?.data;

  // Error handling
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Không thể tải thông tin cộng đồng.
        </h2>
        <p className="text-gray-500 mb-4">
          {error?.message || "Đã xảy ra lỗi khi tải dữ liệu"}
        </p>
        <ButtonMain onClick={() => refetch()}>Thử lại</ButtonMain>
      </div>
    );
  }

  // Loading state
  if (isLoading && !data) {
    return <ProfileSkeleton />;
  }

  // Community not found
  if (data?.statusCode === 404 || !community) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold text-gray-600 mb-2">
          Không tìm thấy cộng đồng.
        </h2>
        <p className="text-gray-500">{slug} không tồn tại hoặc đã bị xóa.</p>
      </div>
    );
  }

  console.log("community::", community);

  return (
    <div>
      {/* Header */}
      <div className="px-3 border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">{community?.name}</p>
        </div>
      </div>

      {/*  */}
      <div className="max-h-screen overflow-y-auto scrollbar-hide">
        {/* Photo cover */}
        <div className="w-full h-60">
          {community?.cover ? (
            <img
              src={community?.cover}
              alt="Cover Photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-gray-300 w-full h-full" />
          )}
        </div>

        {/* Community Section */}
        <div className="px-4 mt-4">
          {/* <!-- Name and Category --> */}
          <div className="flex justify-between">
            <h2 className="text-xl font-bold flex items-center gap-1">
              {community?.name}{" "}
              <VerifyIcon
                active={!!community?.verify}
                size={20}
                color="orange"
              />
            </h2>
            <div className="flex items-center gap-3">
              {/*  */}
              <CommunitySetting community={community} />

              {/*  */}
              <CommunityInfo community={community} />

              {/*  */}
              <CommunityInvite community={community} />

              {/*  */}
              <CommunityJoinLeave community={community} />
            </div>
          </div>
          <div className="my-3 px-3 rounded-2xl border inline-block">
            <span className="text-[15px] font-medium">
              {community?.category}
            </span>
          </div>

          {/* <!-- Bio --> */}
          <div className="mb-3">
            {community?.bio?.split("\\n").map((p) => (
              <p className="leading-relaxed" key={p}>
                {p}
              </p>
            ))}
          </div>

          {/* <!-- Join Date --> */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                Đã tạo{" "}
                {formatDateToDateVN(new Date(community?.created_at || ""))}
              </span>
            </div>
          </div>

          {/* <!-- Members --> */}
          <div className="flex items-center space-x-4 text-sm mb-4">
            <Link
              to={`/${slug}/followers`}
              className="hover:underline cursor-pointer"
            >
              <span className="font-semibold">{community.member_count}</span>
              <span className="text-gray-500"> thành viên</span>
            </Link>
          </div>
        </div>

        {/* Tweets and media*/}
        <Tabs defaultValue={ETweetType.Tweet.toString()} className="mb-12">
          <div className="bg-white sticky mt-4 top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer"
                value={ETweetType.Tweet.toString()}
              >
                Bài viết
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="highlights">
                Nổi bật
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="media">
                Hình ảnh/video
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="pt-0">
            <TabsContent
              value={ETweetType.Tweet.toString()}
              className="px-0 py-4"
            >
              <div className="space-y-4"></div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
