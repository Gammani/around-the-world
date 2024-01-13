import { LikeStatus } from '../../../../types';

type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};

export type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
};

export type CommentViewModel = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: LikesInfoType;
};

export type CommentsWithPaginationViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentViewModel[];
};
