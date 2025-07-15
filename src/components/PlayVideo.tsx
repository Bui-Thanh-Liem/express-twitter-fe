import ReactPlayer from "react-player";

export function PlayVideo({ src }: { src: string }) {
  return (
    <ReactPlayer
      src={src}
      controls
      playing={false}
      width="100%"
      height="100%"
    ></ReactPlayer>
  );
}
