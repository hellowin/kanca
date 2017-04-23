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

declare type Post = {
  created_time: string,
  id: string,
  updated_time: string,
  story?: string,
  from?: {
    name: string,
    id: string,
  },
  status_type: string,
  type: string,
  permalink_url: string,
  likes: {
    data: {
      id: string,
      name: string,
    }[],
    paging?: {
      cursors: {
        before: string,
        after: string,
      }
    }
  },
  shares: {
    count: number,
  },
  comments: {
    data: {
      id: string,
      from: {
        name: string,
        id: string,
      },
      message: string,
      likes: {
        data: {
          id: string,
          name: string,
        }[],
        paging?: {
          cursors: {
            before: string,
            after: string,
          }
        }
      }
    }[],
    paging?: {
      cursors: {
        before: string,
        after: string,
      }
    }
  }
}