import { useState } from "react";
import { MediaContent } from "~/components/list-tweets/item-tweet";
import { useGetProfileMedia } from "~/hooks/useFetchTweet";
import { EMediaType } from "~/shared/enums/type.enum";
import { NotFountProfileTweet } from "./not-found";

export function ProfileMedia({ profile_id }: { profile_id: string }) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetProfileMedia({
    limit: "20",
    profile_id,
    page: page.toString(),
  });

  if (data?.data?.total === 0) {
    return <NotFountProfileTweet />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.data?.items?.map((m) => {
        return (
          <div key={m.media?.url} className="-mb-6">
            <MediaContent
              type={m.media?.type || EMediaType.Image}
              url={m.media?.url || ""}
            />
          </div>
        );
      })}
    </div>
  );
}
