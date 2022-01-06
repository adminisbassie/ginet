export enum routes {
  DASHBOARD = '/app/dashboard',
  PROFILE = '/app/profile',
  CHANGE_PASSWORD = '/app/change-password',
  LOGIN = '/login',

  // --- CRUD module ---//

  Users = '/admin/users',
  Users_CREATE = '/admin/users/new',
  Users_EDIT = '/admin/users/edit',

  Posts = '/admin/posts',
  Posts_CREATE = '/admin/posts/new',
  Posts_EDIT = '/admin/posts/edit',

  Reaction = '/admin/reaction',
  Reaction_CREATE = '/admin/reaction/new',
  Reaction_EDIT = '/admin/reaction/edit',

  Comments = '/admin/comments',
  Comments_CREATE = '/admin/comments/new',
  Comments_EDIT = '/admin/comments/edit',

  Messages = '/admin/messages',
  Messages_CREATE = '/admin/messages/new',
  Messages_EDIT = '/admin/messages/edit',

  Groups = '/admin/groups',
  Groups_CREATE = '/admin/groups/new',
  Groups_EDIT = '/admin/groups/edit',
}
