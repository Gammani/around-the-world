export enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};
