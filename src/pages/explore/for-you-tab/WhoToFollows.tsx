import { useEffect, useState } from "react";
import { LoadingProcess } from "~/components/loading-process";
import { WhoToFollowItem } from "~/components/who-to-follow/who-to-follow-item";
import { useGetTopFollowedUsers } from "~/hooks/useFetchUser";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export function WhoToFollows() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);

  //
  const { data, isLoading } = useGetTopFollowedUsers({
    page: page.toString(),
    limit: "10",
  });

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.data?.items || [];
    if (items) {
      setUsers((prev) => [...prev, ...items]);
    }
  }, [data]);

  //
  function onSeeMoreWhoToFollows() {
    setPage((prev) => prev + 1);
  }

  //
  return (
    <>
      <p className="text-xl font-bold mt-3 py-2 sticky top-16 z-40 bg-gray-50">
        Ai để theo dõi
      </p>
      <div>
        {users.map((item) => (
          <WhoToFollowItem key={item._id} item={item} />
        ))}
      </div>
      {isLoading ? (
        <LoadingProcess />
      ) : (
        <div className="px-4 py-3">
          <div onClick={onSeeMoreWhoToFollows}>
            <p className="inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer">
              Xem thêm
            </p>
          </div>
        </div>
      )}
    </>
  );
}
