export const formatTimeUntil = (futureDateString: string) => {
  if (!futureDateString) return "";

  const now = new Date();
  const futureDate = new Date(futureDateString);

  // Nếu ngày đã qua hoặc bằng hiện tại
  if (futureDate <= now) return "đã đến hạn";

  const diffInMinutes = Math.floor(
    (futureDate.getTime() - now.getTime()) / (1000 * 60)
  );
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "sắp tới";
  if (diffInMinutes < 60) return `còn ${diffInMinutes} phút`;
  if (diffInHours < 24) return `còn ${diffInHours} giờ`;
  if (diffInDays < 7) return `còn ${diffInDays} ngày`;

  // Nếu còn lâu hơn 7 ngày, hiển thị ngày cụ thể
  return `còn đến ngày ${futureDate.toLocaleDateString("vi-VN")}`;
};
