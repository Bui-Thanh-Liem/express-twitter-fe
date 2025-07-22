import { HLSPlayer } from "./hls/HLSPlayer";

export function MainContent() {
  return (
    <main className="col-span-12 md:col-span-7 p-4 border-r border-l border-gray-200 max-h-screen overflow-y-scroll">
      <h2 className="text-xl font-bold mb-4 text-center">🎥 Video Streaming</h2>
      <video
        src="http://localhost:9000/videos-streaming/6ZbvApnUPurTuUk4qeX9V.mp4"
        controls
        className="w-full h-auto max-h-[500px] rounded-lg shadow mb-6"
      ></video>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-4 text-center">📡 Video HLS</h2>
      <div className="w-full aspect-video rounded-lg shadow overflow-hidden">
        <HLSPlayer src="http://localhost:9000/videos-hls/6ZbvApnUPurTuUk4qeX9V/master.m3u8" />
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-bold mb-4 text-center">📡 Video HLS</h2>
      <div className="w-full aspect-video rounded-lg shadow overflow-hidden">
        <HLSPlayer src="http://localhost:9000/videos-hls/6ZbvApnUPurTuUk4qeX9V/master.m3u8" />
      </div>
    </main>
  );
}
