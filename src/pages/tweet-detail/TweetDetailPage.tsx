import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { SkeletonTweet, TweetItem } from "~/components/list-tweets/item-tweet";
import { Tweet } from "~/components/tweet/Tweet";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetDetailTweet, useGetTweetChildren } from "~/hooks/useFetchTweet";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function TweetDetailPage() {
  //
  const navigate = useNavigate();
  const { tweet_id } = useParams(); // Đặt tên params ở <App />

  //
  const [tweetComments, setTweetComments] = useState<ITweet[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref cho infinite scroll
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  //
  const { data, isLoading: isLoadingDetail } = useGetDetailTweet(tweet_id!);

  // API comments (theo page)
  const { data: comments, isLoading: isLoadingCmm } = useGetTweetChildren({
    tweet_id: tweet_id!,
    tweet_type: ETweetType.Comment,
    queries: {
      page: page.toString(),
      limit: "10",
    },
  });

  // Khi có data mới => append vào list
  useEffect(() => {
    if (comments?.data?.items) {
      const newComments = comments.data.items as ITweet[];

      if (page === 1) {
        setTweetComments(newComments);
      } else {
        setTweetComments((prev) => {
          const existIds = new Set(prev.map((tw) => tw._id));
          const filtered = newComments.filter((tw) => !existIds.has(tw._id));
          return [...prev, ...filtered];
        });
      }

      if (newComments.length < 10) {
        setHasMore(false);
      }
      setIsLoadingMore(false);
    }
  }, [comments, page]);

  // Observer callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoadingCmm &&
        !isLoadingMore &&
        tweetComments.length > 0
      ) {
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoadingCmm, isLoadingMore, tweetComments.length]
  );

  // Setup observer
  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }

    observerInstanceRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0,
      rootMargin: "0px",
    });

    observerInstanceRef.current.observe(element);

    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Reset khi đổi tweet
  useEffect(() => {
    setPage(1);
    // setTweetComments([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [tweet_id]);

  //
  function onDel(id: string) {
    setTweetComments((prev) => prev.filter((tw) => tw._id !== id));
  }

  //
  if (isLoadingDetail) {
    return <SkeletonTweet />;
  }

  // Not found
  if (data?.statusCode === 404 || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold text-gray-600 mb-2">
          Không tìm thấy bài viết
        </h2>
        <p className="text-gray-500">Bài viết không tồn tại hoặc đã bị xóa</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-4">
          <WrapIcon onClick={() => navigate(-1)}>
            <ArrowLeftIcon color="#000" />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Bài viết</p>
        </div>
      </div>

      <div className="max-h-screen overflow-y-auto pb-6">
        <TweetItem tweet={data?.data} onSuccessDel={() => {}} />

        {/*  */}
        <div className="p-4 border-y border-gray-100 pb-0">
          <Tweet
            tweet={data?.data}
            contentBtn="Bình luận"
            tweetType={ETweetType.Comment}
            placeholder="Đăng bình luận của bạn"
          />
        </div>

        {/* COMMENTS */}
        <div>
          {tweetComments?.length ? (
            tweetComments.map((tw) => {
              return <TweetItem tweet={tw} key={tw._id} onSuccessDel={onDel} />;
            })
          ) : isLoadingCmm ? (
            <SkeletonTweet />
          ) : (
            <div className="flex h-24">
              <p className="m-auto text-gray-400 text-sm">Chưa có bình luận</p>
            </div>
          )}
        </div>

        {/* Loading more */}
        {isLoadingMore && (
          <div className="py-4">
            <SkeletonTweet />
          </div>
        )}

        {/* Observer element */}
        <div ref={observerRef} className="h-10 w-full" />

        {/* End message */}
        {!hasMore && tweetComments.length > 0 && (
          <div className="text-center py-6 mb-6">
            <p className="text-gray-500">🎉 Bạn đã xem hết tất cả bình luận!</p>
          </div>
        )}
      </div>
    </>
  );
}
