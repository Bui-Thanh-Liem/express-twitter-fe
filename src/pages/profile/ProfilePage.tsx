import { Calendar, Globe, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { CloseIcon } from "~/components/icons/close";
import { VerifyIcon } from "~/components/icons/verify";
import { LoadingProcess } from "~/components/loading-process";
import { AvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import {
  useGetOneByUsername,
  useResendVerifyEmail,
} from "~/hooks/useFetchUser";
import { ETweetType } from "~/shared/enums/type.enum";
import { useUserStore } from "~/store/useUserStore";
import { formatDateToDateVN } from "~/utils/formatDateToDateVN";
import { handleResponse } from "~/utils/handleResponse";
import { ProfileAction } from "./ProfileAction";
import { ProfileLiked } from "./ProfileLiked";
import { ProfileMedia } from "./ProfileMedia";
import { ProfileTweets } from "./ProfileTweets";

export function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams(); // Đặt tên params ở <App />
  const { user } = useUserStore();
  const { data, refetch, isLoading, error } = useGetOneByUsername(username!);
  const apiResendVerifyEmail = useResendVerifyEmail();

  // Extract profile data to avoid repetitive data?.data calls
  const profile = data?.data;

  //
  const [isOpenVerify, setOpenVerify] = useState(false);

  // Check if current user is viewing their own profile
  const isOwnProfile = useMemo(
    () => user?._id === profile?._id,
    [user?._id, profile?._id]
  );

  useEffect(() => {
    setOpenVerify(Boolean(!profile?.verify));
  }, [profile?.verify]);

  //
  useEffect(() => {
    if (username) {
      refetch(); // Gọi lại API khi username thay đổi
    }
  }, [username, refetch]);

  // Error handling
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Không thể tải hồ sơ
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
    return <LoadingProcess />;
  }

  // User not found
  if (data?.statusCode === 404) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold text-gray-600 mb-2">
          Không tìm thấy người dùng
        </h2>
        <p className="text-gray-500">{username} không tồn tại hoặc đã bị xóa</p>
      </div>
    );
  }

  //
  async function resendVerifyEmail() {
    const res = await apiResendVerifyEmail.mutateAsync();
    handleResponse(res);
  }

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-6 ">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </WrapIcon>
          <p className="font-semibold text-[20px]">{profile?.name}</p>
        </div>

        {/* <WrapIcon>
          <SearchIcon />
        </WrapIcon> */}
      </div>

      <div className="max-h-screen overflow-y-auto">
        {/* Photo cover */}
        <div className="relative w-full">
          <div className="w-full h-52">
            {profile?.cover_photo ? (
              <img
                src={profile?.cover_photo}
                alt="Cover Photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="bg-gray-300 w-full h-full" />
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className="px-4">
          {/* Avatar and Edit Button */}
          <div className="flex justify-between items-start -mt-16 mb-3">
            <AvatarMain
              src={profile?.avatar}
              alt={profile?.name}
              className="w-32 h-32 border-4 border-white"
            />

            <ProfileAction profile={profile!} isOwnProfile={isOwnProfile} />
          </div>

          {/* <!-- Name and Username --> */}
          <div className="mb-3">
            <h2 className="text-xl font-bold flex items-center gap-1">
              {profile?.name}{" "}
              <VerifyIcon active={!!profile?.verify} size={20} />
            </h2>
            <p className="text-gray-500">{profile?.username}</p>
          </div>

          {/* <!-- Bio --> */}
          <div className="mb-3">
            {profile?.bio?.split("\\n").map((p) => (
              <p className="leading-relaxed" key={p}>
                {p}
              </p>
            ))}
          </div>

          {/* <!-- Location, Website and Join Date --> */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm mb-3">
            {profile?.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{profile?.location}</span>
              </div>
            )}
            {profile?.website && (
              <a href={profile.website} target="_blank">
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{profile?.website}</span>
                </div>
              </a>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                Đã tham gia{" "}
                {formatDateToDateVN(new Date(profile?.created_at || ""))}
              </span>
            </div>
          </div>

          {/* <!-- Following and Followers --> */}
          <div className="flex items-center space-x-4 text-sm mb-4">
            <div className="hover:underline cursor-pointer">
              <span className="font-semibold">{profile?.following_count}</span>
              <span className="text-gray-500"> Following</span>
            </div>
            <div className="hover:underline cursor-pointer">
              <span className="font-semibold">{profile?.follower_count}</span>
              <span className="text-gray-500"> Followers</span>
            </div>
          </div>

          {/* Verify email */}
          {isOwnProfile && isOpenVerify && (
            <div className="mt-4 mb-4 bg-green-100 border border-green-200 rounded-xl p-4 relative">
              <button
                className="outline-0 absolute top-3 right-3 text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setOpenVerify(false)}
              >
                <CloseIcon color="#333" size={18} />
              </button>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-black font-bold text-lg">
                  Bạn chưa được xác minh
                </h3>
                <VerifyIcon color="#000" size={22} />
              </div>
              <p className="text-gray-700 mb-4">
                Hãy xác minh để nhận được phản hồi tốt hơn, phân tích, duyệt web
                không quảng cáo và nhiều hơn nữa. Nâng cấp hồ sơ của bạn ngay.
              </p>
              <ButtonMain onClick={resendVerifyEmail}>Xác minh</ButtonMain>
            </div>
          )}
        </div>

        {/* Tweets and media*/}
        <Tabs defaultValue={ETweetType.Tweet.toString()} className="mb-12">
          <div className="bg-white p-2 px-4 sticky top-0 z-50">
            <TabsList className="w-full">
              <TabsTrigger
                className="cursor-pointer"
                value={ETweetType.Tweet.toString()}
              >
                Bài viết
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer"
                value={ETweetType.Retweet.toString()}
              >
                Bài viết đã đăng lại
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="highlights">
                Nổi bật
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="media">
                Hình ảnh/video
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="likes">
                Đã thích
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-4 pt-0">
            <TabsContent
              value={ETweetType.Tweet.toString()}
              className="px-0 py-4"
            >
              <div className="space-y-4">
                <ProfileTweets
                  tweetType={ETweetType.Tweet}
                  profile_id={profile?._id}
                />
              </div>
            </TabsContent>
            <TabsContent
              value={ETweetType.Retweet.toString()}
              className="px-0 py-4"
            >
              <div className="space-y-4">
                <ProfileTweets
                  tweetType={ETweetType.Retweet}
                  profile_id={profile?._id}
                />
              </div>
            </TabsContent>
            <TabsContent value="highlights" className="px-0 py-4">
              <div className="space-y-4">
                <ProfileTweets
                  ishl={"1"}
                  tweetType={ETweetType.Tweet}
                  profile_id={profile?._id}
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="px-0 py-4">
              <div className="space-y-4">
                <ProfileMedia profile_id={profile?._id} />
              </div>
            </TabsContent>
            <TabsContent value="likes" className="px-0 py-4">
              <div className="space-y-4">
                <ProfileLiked profile_id={profile?._id} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
