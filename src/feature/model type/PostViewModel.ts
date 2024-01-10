import { LikeStatus } from '../types';

export type CreateInputPostModelType = {
  title: string;
  shortDescription: string;
  content: string;
};
export type CreateInputPostWithBlogIdModelType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export type NewestLikesViewModel = {
  addedAt: string;
  userId: string;
  login: string;
};
export type customFilteredPostLikesType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: NewestLikesViewModel[];
  };
};
export type ExtendedLikesInfoViewModel = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: NewestLikesViewModel[];
};
export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoViewModel;
};
export type PostsWithPaginationViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostViewModel[];
};
export type UpdateInputPostModelType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
