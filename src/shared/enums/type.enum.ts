export enum ETweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet, // đăng lại và thêm được content của mình
}

export enum EMediaType {
  Image,
  Video,
}

export enum ETokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  VerifyToken,
}

export enum EFeedType {
  All = "all", // New feeds tổng (everyone + following)
  Everyone = "everyone", // Chỉ người mình everyone
  Following = "following", // Chỉ người mình follow
}

export enum EFeedTypeItem {
  Tweet = "tweet",
  Community = "Community",
}

export enum EConversationType {
  Private,
  Group,
}

export enum ENotificationType {
  Community = "community",
  Mention_like = "mention-like",
  Follow = "follow",
  Other = "other",
}

export enum EMembershipType {
  Open = "Mở",
  Invite_only = "Chỉ được mời",
}

export enum EVisibilityType {
  Public = "Công cộng",
  Private = "Riêng tư",
}
