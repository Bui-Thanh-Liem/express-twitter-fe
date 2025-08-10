import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { CalendarIcon } from "~/components/icons/calendar";
import { CloseIcon } from "~/components/icons/close";
import { DotIcon } from "~/components/icons/dot";
import { LocationIcon } from "~/components/icons/location";
import { MessageIcon } from "~/components/icons/messages";
import { SearchIcon } from "~/components/icons/search";
import { VerifyIcon } from "~/components/icons/verify";
import { LoadingProcess } from "~/components/loading-process";
import { AvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetOneByUsername } from "~/hooks/useFetchUser";
import { useUserStore } from "~/store/useUserStore";

export function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams(); // Đặt tên params ở <App />
  const { user } = useUserStore();
  const [isOpenVerify, setOpenVerify] = useState(true);
  const { data, refetch, isLoading, error } = useGetOneByUsername(username!);

  // Extract profile data to avoid repetitive data?.data calls
  const profile = data?.data;

  // Check if current user is viewing their own profile
  const isOwnProfile = useMemo(
    () => user?._id === profile?._id && Boolean(!user?.verify),
    [user?._id, profile?._id, user?.verify]
  );

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
          Không thể tải profile
        </h2>
        <p className="text-gray-500 mb-4">
          {error.message || "Đã xảy ra lỗi khi tải dữ liệu"}
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
        <p className="text-gray-500">
          @{username} không tồn tại hoặc đã bị xóa
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex items-center gap-6 ">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </WrapIcon>
          <div>
            <p className="font-semibold text-[20px]">{profile?.name}</p>
            <p className="text-gray-400 text-sm">2 posts</p>
          </div>
        </div>

        <WrapIcon>
          <SearchIcon />
        </WrapIcon>
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

            {isOwnProfile ? (
              <ButtonMain variant="outline" className="mt-20">
                Edit profile
              </ButtonMain>
            ) : (
              <div className="flex items-center gap-x-3 mt-20">
                <WrapIcon className="border">
                  <DotIcon size={18} />
                </WrapIcon>
                <WrapIcon className="border">
                  <MessageIcon size={18} />
                </WrapIcon>
                <ButtonMain size="sm">Theo dõi</ButtonMain>
              </div>
            )}
          </div>

          {/* <!-- Name and Username --> */}
          <div className="mb-3">
            <h2 className="text-2xl font-bold">{profile?.name}</h2>
            <p className="text-gray-500">@{profile?.username}</p>
          </div>

          {/* <!-- Bio --> */}
          <div className="mb-3">
            <p className="leading-relaxed">{profile?.bio}</p>
          </div>

          {/* <!-- Location and Join Date --> */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm mb-3">
            {profile?.location && (
              <div className="flex items-center space-x-1">
                <LocationIcon />
                <span>{profile?.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <CalendarIcon />
              <span>
                Joined March{" "}
                {new Date(profile?.created_at || "").getUTCFullYear()}
              </span>
            </div>
          </div>

          {/* <!-- Following and Followers --> */}
          <div className="flex items-center space-x-4 text-sm mb-4">
            <div className="hover:underline cursor-pointer">
              <span className="font-semibold">123</span>
              <span className="text-gray-500"> Following</span>
            </div>
            <div className="hover:underline cursor-pointer">
              <span className="font-semibold">1.2K</span>
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
              <ButtonMain>Xác minh</ButtonMain>
            </div>
          )}
        </div>

        {/*  */}
        <Tabs defaultValue="posts" className="mb-12">
          <div className="bg-white p-2 px-4 sticky top-0">
            <TabsList className="w-full">
              <TabsTrigger className="cursor-pointer" value="posts">
                Posts
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="replies">
                Replies
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="highlights">
                Highlights
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="articles">
                Articles
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="media">
                Media
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="likes">
                Likes
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-4 pt-0">
            <TabsContent value="posts" className="px-0 py-4">
              <div className="space-y-4">
                <p>Posts content here...</p>
                {/* Add more content to demonstrate scrolling */}
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Post {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="replies" className="px-0 py-4">
              <div className="space-y-4">
                <p>Replies content here...</p>
                {Array.from({ length: 15 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Reply {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="highlights" className="px-0 py-4">
              <div className="space-y-4">
                <p>Highlights content here...</p>
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Highlight {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="articles" className="px-0 py-4">
              <div className="space-y-4">
                <p>Articles content here...</p>
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Article {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="media" className="px-0 py-4">
              <div className="space-y-4">
                <p>Media content here...</p>
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Media {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="likes" className="px-0 py-4">
              <div className="space-y-4">
                <p>Likes content here...</p>
                {Array.from({ length: 25 }, (_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <p>Liked post {i + 1} content...</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
