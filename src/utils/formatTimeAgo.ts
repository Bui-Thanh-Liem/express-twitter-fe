export const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "Vừa xong";

  const now = new Date();
  const createdDate = new Date(dateString);

  const diffInMinutes = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60)
  );
  const diffInHours = Math.floor(diffInMinutes / 60);

  // Calendar day difference (không phụ thuộc đủ 24h hay chưa)
  const diffInDays = Math.floor(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(
        createdDate.getFullYear(),
        createdDate.getMonth(),
        createdDate.getDate()
      ).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút`;
    return `${diffInHours} giờ`;
  }

  if (diffInDays === 1) return "Hôm qua";
  if (diffInDays < 7) return `${diffInDays} ngày`;
  return createdDate.toLocaleDateString("vi-VN");
};
