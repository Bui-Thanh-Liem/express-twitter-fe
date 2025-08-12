// Utility function để format thời gian
export const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "Vừa xong";

  const now = new Date();
  const createdDate = new Date(dateString);
  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // Kiểm tra xem có cùng ngày không
  const isSameDay = now.toDateString() === createdDate.toDateString();

  if (isSameDay) {
    // Trong ngày - hiện giờ
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes < 1) return "Vừa xong";
      return `${diffInMinutes}p`;
    }
    return `${diffInHours}h`;
  } else {
    // Qua ngày - hiện ngày
    if (diffInDays === 1) {
      return "Hôm qua";
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày`;
    } else {
      return createdDate.toLocaleDateString("vi-VN");
    }
  }
};
