import audio from "../../public/sounds/notification.mp3";

const sound = new Audio(audio);

export function playNotificationSound() {
  sound.currentTime = 0; // reset nếu đang phát
  sound.play().catch((err) => {
    console.log("User chưa tương tác => không phát được âm thanh:", err);
  });
}
