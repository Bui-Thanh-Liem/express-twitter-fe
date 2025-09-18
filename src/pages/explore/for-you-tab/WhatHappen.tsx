import { useEffect } from "react";
import { WhatHappenItem } from "~/components/what-happen/what-happen-item";
import { useGetTrending } from "~/hooks/useFetchSearchSuggest";

export function WhatHappen() {
  const { data } = useGetTrending({
    page: "1",
    limit: "20",
  });

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
  }, []);

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
        Chuyện gì xảy ra
      </p>
      <div>
        {data?.data?.items?.map((item) => (
          <WhatHappenItem key={item._id} item={item} />
        ))}
      </div>
    </>
  );
}
