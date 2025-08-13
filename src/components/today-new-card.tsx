export function TodayNewCard() {

}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

export function NewsCard({ onClose }) {
  const news = [
    {
      id: 1,
      title: "Bessent Urges Fed for Rate Reduction in September",
      time: "19 hours ago",
      category: "News",
      posts: "14.3K posts",
      avatars: ["/avatar1.png", "/avatar2.png", "/avatar3.png"],
    },
    {
      id: 2,
      title: "Texas GOP Senate Primary: Cornyn vs. Paxton",
      time: "2 hours ago",
      category: "News",
      posts: "1,406 posts",
      avatars: ["/avatar4.png", "/avatar5.png"],
    },
    {
      id: 3,
      title: "Starlink Launches in Kazakhstan",
      time: "10 hours ago",
      category: "News",
      posts: "12.8K posts",
      avatars: ["/avatar6.png"],
    },
  ]

  return (
    <Card className="w-[350px] rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Today's News</CardTitle>
        <X className="h-4 w-4 cursor-pointer" onClick={onClose} />
      </CardHeader>
      <CardContent className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="flex gap-3">
            {/* Avatars */}
            <div className="flex -space-x-2">
              {item.avatars.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt=""
                  className="h-6 w-6 rounded-full border-2 border-background"
                />
              ))}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-sm font-medium leading-snug hover:underline cursor-pointer">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.time} · {item.category} · {item.posts}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
