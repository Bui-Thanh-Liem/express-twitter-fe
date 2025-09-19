import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  WhatHappenItem,
  WhatHappenItemSkeleton,
} from "~/components/what-happen/what-happen-item";
import { useGetTrending } from "~/hooks/useFetchSearchSuggest";
import { cn } from "~/lib/utils";
import type { ISearchSuggest } from "~/shared/interfaces/schemas/searchSuggest.interface";

export function WhatHappen() {
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [searSuggests, setSearSuggests] = useState<ISearchSuggest[]>([]);

  const total_page_ref = useRef(0);
  const { data, isLoading } = useGetTrending({
    page: page.toString(),
    limit: "10",
  });

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.data?.items || [];
    const total_page = data?.data?.total_page;
    total_page_ref.current = total_page || 0;
    if (items) {
      setSearSuggests((prev) => [...prev, ...items]);
    }
  }, [data]);

  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  // Scroll to top khi có hash #what-happen
  useEffect(() => {
    if (window.location.hash === "#what-happen") {
      const el = document.getElementById("what-happen");

      if (el) {
        setTimeout(() => {
          console.log("Tiến hành scroll");

          // Debug: Kiểm tra lại offsetTop sau timeout
          console.log("Element offsetTop after timeout:", el.offsetTop);

          //
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }, 200);
      } else {
        console.log("Element not found!");
      }
    }
  }, [location.hash]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setSearSuggests([]);
    };
  }, []);

  //
  return (
    <>
      <a
        id="what-happen"
        className="block"
        style={{
          scrollMarginTop: "40px",
        }}
      ></a>
      <p className="text-xl font-bold mt-4 py-2 bg-gray-50 sticky top-16 z-30">
        Chuyện gì đang xảy ra
      </p>
      <div>
        {searSuggests?.map((item) => (
          <WhatHappenItem key={item._id} item={item} />
        ))}
      </div>
      {isLoading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <WhatHappenItemSkeleton key={`more-${i}`} />
        ))
      ) : (
        <div className="px-4 py-3">
          <p
            className={cn(
              "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
              total_page_ref.current <= page
                ? "text-gray-300 pointer-events-none cursor-default"
                : ""
            )}
            onClick={onSeeMore}
          >
            Xem thêm
          </p>
        </div>
      )}
    </>
  );
}
