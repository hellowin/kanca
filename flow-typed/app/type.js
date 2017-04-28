declare type UserProfile = {
  facebookId: string,
  name: string,
  email: string,
  picture: string,
}

declare type Group = {
  id: string,
  name: string,
  privacy: string,
  cover: string,
  description: string,
  owner: {
    id: string,
    name: string,
  }
}

declare type List<T> = {
  data: T[],
  paging?: {
    cursors: {
      before: string,
      after: string,
    }
  }
}

declare type Like = {
  id: string,
  name: string,
}

declare type Comment = {
  id: string,
  created_time: string,
  from: {
    name: string,
    id: string,
  },
  message: string,
  likes: List<Like>,
  comments: List<Comment>,
  parent?: string,
  hierarchy?: number,
}

declare type Post = {
  created_time: string,
  id: string,
  updated_time: string,
  caption?: string,
  story?: string,
  picture?: string,
  message?: string,
  description?: string,
  name?: string,
  from?: {
    name: string,
    id: string,
  },
  status_type: string,
  type: string,
  permalink_url: string,
  likes: List<Like>,
  shares: {
    count: number,
  },
  comments: List<Comment>,
}

declare type Member = {
  id: string,
  name: string,
  picture: {
    data: {
      is_silhouette: boolean,
      url: string,
    }
  },
  link: string,
  administrator: boolean,
}
