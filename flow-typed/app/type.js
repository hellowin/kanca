// bakalan buat user

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