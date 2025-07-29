import { HLSPlayer } from "@/components/hls/HLSPlayer";

export const ForYouContent = () => (
  <>
    <h2 className="text-xl font-bold mb-4 text-center">🎥 Video Streaming</h2>
    <video
      src="http://localhost:9000/videos-streaming/6ZbvApnUPurTuUk4qeX9V.mp4"
      controls
      className="w-full h-auto max-h-[500px] rounded-lg shadow mb-6"
    ></video>

    <hr className="my-6" />

    {/* Multiple HLS Video Players */}
    {Array.from({ length: 11 }, (_, index) => (
      <div key={index}>
        <h2 className="text-xl font-bold mb-4 text-center">📡 Video HLS</h2>
        <div className="w-full aspect-video rounded-lg shadow overflow-hidden mb-6">
          <HLSPlayer src="http://localhost:9000/videos-hls/l6Go2iZ5UUyrGknbPpZhn/master.m3u8" />
        </div>
        {index < 10 && <hr className="my-6" />}
      </div>
    ))}
  </>
);
