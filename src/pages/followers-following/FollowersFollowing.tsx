import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetOneByUsername } from "~/hooks/useFetchUser";
import { FollowersPage } from "./FollowersPage";
import { FollowingPage } from "./FollowingPage";

const followers_type = "followers";
const following_type = "following";

export function FollowersFollowing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useParams();

  // ✅ Xác định type theo pathname hiện tại
  const type = location.pathname.endsWith("/followers")
    ? followers_type
    : following_type;

  // ✅ Lấy dữ liệu user
  const { data } = useGetOneByUsername(username!);
  const profile = data?.data;

  // ✅ Khi người dùng đổi tab → điều hướng sang route tương ứng
  const handleTabChange = (value: string) => {
    navigate(`/${username}/${value}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <div>
            <p className="font-semibold text-lg">{profile?.name}</p>
            <p className="text-gray-400 text-xs -mt-0.5">{profile?.username}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Tabs value={type} onValueChange={handleTabChange} className="mb-12">
        <div className="bg-white sticky top-0 z-50">
          <TabsList className="w-full">
            <TabsTrigger value={followers_type}>Người theo dõi</TabsTrigger>
            <TabsTrigger value={following_type}>Đang theo dõi</TabsTrigger>
          </TabsList>
        </div>

        <div className="pt-0">
          <TabsContent value={followers_type} className="px-0 py-4">
            <FollowersPage />
          </TabsContent>

          <TabsContent value={following_type} className="px-0 py-4">
            <FollowingPage />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
