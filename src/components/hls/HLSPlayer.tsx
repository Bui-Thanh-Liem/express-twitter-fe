import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import { textTracks } from "./track";

export function HLSPlayer({ src }: { src: string }) {
  return (
    <MediaPlayer title="twitter" src={src} >
      <MediaProvider>
        {textTracks.map((track) => (
          <Track {...track} key={track.src} />
        ))}
      </MediaProvider>
      <DefaultVideoLayout
        // thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        icons={defaultLayoutIcons}
      />
    </MediaPlayer>
  );
}
