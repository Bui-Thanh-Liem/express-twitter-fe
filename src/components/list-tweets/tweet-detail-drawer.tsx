"use client";

import { BarChart3, Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useGetTweetChildren } from "~/hooks/useFetchTweet";
import { EMediaType, ETweetType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useDetailTweetStore } from "~/store/useDetailTweetStore";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { ArrowLeftIcon } from "../icons/arrow-left";
import { VerifyIcon } from "../icons/verify";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { AvatarMain } from "../ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "../ui/drawer";
import { WrapIcon } from "../wrapIcon";
import { ActionBookmarkTweet } from "./action-bookmark-tweet";
import { ActionCommentTweet } from "./action-comment-tweet";
import { ActionLikeTweet } from "./action-like-tweet";
import { ActionRetweetQuoteTweet } from "./action-retweet-quote-tweet";
import { Content } from "./content";
import { MediaContent, SkeletonTweet, TweetItem } from "./item-tweet";
import { useEffect } from "react";

export function TweetDetailDrawer() {
  //
  const { pathname } = useLocation();

  //
  const { tweet, close, isOpen, prevTweet, setTweet, setPrevTweet } =
    useDetailTweetStore();

  //

  useEffect(() => {
    close();
  }, [close, pathname]);

  // Gọi api comments
  const { data, isLoading } = useGetTweetChildren({
    tweet_id: tweet?._id,
    tweet_type: ETweetType.Comment,
    queries: {
      page: "1",
      limit: "20",
    },
  });
  const tweetComments = data?.data?.items;

  // Không có tweet thì chỉ xem không xem chi tiết được
  if (!tweet) {
    return <></>;
  }

  //
  const {
    content,
    user_id,
    media,
    created_at,
    mentions,
    comments_count,
    user_view,
    guest_view,
    likes_count,
    retweets_count,
    quotes_count,
  } = tweet;
  const author = user_id as IUser;

  //
  function handleClickPrev(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setTweet(prevTweet);
    setPrevTweet(undefined);
  }

  //
  return (
    <>
      <Drawer direction="right" open={isOpen}>
        <DrawerOverlay className="bg-black/90" />

        {/* Các phần tử nằm trên overlay, ngoài DrawerOverlay */}
        {isOpen && (
          <div
            className="fixed top-0 left-0 w-3/4 z-[1500] h-screen p-4 pl-28"
            onClick={() => close()}
          >
            {/* Content tweet */}
            <div className="h-full relative">
              {prevTweet && (
                <WrapIcon
                  className="absolute -left-16 bg-black cursor-pointer hover:bg-black/85 z-[2000]"
                  onClick={handleClickPrev}
                >
                  <ArrowLeftIcon color="#fff" />
                </WrapIcon>
              )}

              <div className="h-[92%]">
                {media ? (
                  <MediaContent
                    tweet={undefined}
                    url={media?.url || ""}
                    type={media?.type || EMediaType.Image}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-white">
                    <p>Bài viết này không có hình ảnh hay video</p>
                  </div>
                )}
              </div>

              {/*  */}
              <div className="flex justify-center gap-28 mt-8">
                <div className="text-white flex items-center gap-3">
                  <MessageCircle size={24} />
                  <span className="text-sm">{comments_count || 0}</span>
                </div>
                <div className="text-white flex items-center gap-3">
                  <Repeat2 size={24} />
                  <span className="text-sm">
                    {" "}
                    {(retweets_count || 0) + (quotes_count || 0)}
                  </span>
                </div>
                <div className="text-white flex items-center gap-3">
                  <Heart size={24} />
                  <span className="text-sm">{likes_count || 0}</span>
                </div>
                <div className="text-white flex items-center gap-3">
                  <BarChart3 size={24} />
                  <span className="text-sm">{user_view + guest_view}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DrawerContent className="h-screen max-h-screen overflow-y-auto overflow-x-hidden">
          <div className="">
            {/*  */}
            <DrawerHeader>
              <DrawerTitle className="flex items-center space-x-2">
                <div className="flex items-center mb-3">
                  <AvatarMain
                    src={author.avatar}
                    alt={author.name}
                    className="mr-3"
                  />
                  <div>
                    <ShortInfoProfile profile={tweet.user_id as IUser}>
                      <Link
                        to={`/${author.username}`}
                        className="flex items-center gap-2"
                      >
                        <h3 className="text-lg font-semibold hover:underline hover:cursor-pointer">
                          {author.name}
                        </h3>
                        <VerifyIcon active={!!author.verify} size={20} />
                      </Link>
                    </ShortInfoProfile>
                    <p className="text-sm text-gray-500">
                      {author.username} •{" "}
                      {formatTimeAgo(created_at as unknown as string)}
                    </p>
                  </div>
                </div>
              </DrawerTitle>
              <DrawerDescription className="text-gray-700 text-base">
                <Content content={content} mentions={mentions} />
              </DrawerDescription>
            </DrawerHeader>

            {/* ACTIONS */}
            <div className="p-4 sticky -top-4 bg-white z-50">
              <div className="flex items-center justify-between text-gray-500 border-y border-gray-100 py-3">
                {/* Comment */}
                <ActionCommentTweet tweet={tweet} />

                {/* Retweet and Quote */}
                <ActionRetweetQuoteTweet tweet={tweet} />

                {/* Likes */}
                <ActionLikeTweet tweet={tweet} />

                {/* Bookmark and Shared */}
                <div className="flex items-center space-x-1">
                  <ActionBookmarkTweet tweet={tweet} />
                  <button className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                    <Share size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* COMMENTS */}
            {tweetComments?.length ? (
              tweetComments.map((tw) => {
                return <TweetItem tweet={tw} key={tw._id} />;
              })
            ) : isLoading ? (
              <SkeletonTweet />
            ) : (
              <div className="flex h-24">
                <p className="m-auto text-gray-400 text-sm">
                  Chưa có bình luận
                </p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
