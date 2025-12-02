import type { MediaItem } from "~/hooks/useMediaPreviewMulti";
import { EMediaType } from "~/shared/enums/type.enum";

export interface IMedia {
  url?: string;
  public_id: string;
  resource_type: EMediaType;
}

export interface PreviewMediaProps {
  mediaItems: MediaItem[];
  removeMedia: (id: string) => void;
}
