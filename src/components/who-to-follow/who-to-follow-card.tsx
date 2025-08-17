import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WhoToFollowItem } from "./who-to-follow-item";

// eslint-disable-next-line react-refresh/only-export-components
export const initial_whoToFollows: Partial<IUser>[] = [
  {
    _id: 1,
    name: "MrBeast",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/87.jpg",
    username: "Mr_Beast",
    verify: 1,
  },
  {
    _id: 2,
    name: "Kekius Maxiums",
    avatar:
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/76.jpg",
    username: "Kekius_Maximus",
    verify: 0,
  },
];

export function WhoToFollowCard() {
  return (
    <Card className="w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2">
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Ai để theo dõi</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {initial_whoToFollows.map((item) => (
          <WhoToFollowItem key={item._id} item={item} />
        ))}
        <div className="hover:bg-gray-100 px-4 py-3">
          <div>
            <p className="inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer">
              Xem thêm
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
