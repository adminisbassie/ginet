import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersListComponent } from './users-list/users-list.component';

import { PostsCreateComponent } from './posts-create/posts-create.component';
import { PostsEditComponent } from './posts-edit/posts-edit.component';
import { PostsListComponent } from './posts-list/posts-list.component';

import { ReactionCreateComponent } from './reaction-create/reaction-create.component';
import { ReactionEditComponent } from './reaction-edit/reaction-edit.component';
import { ReactionListComponent } from './reaction-list/reaction-list.component';

import { CommentsCreateComponent } from './comments-create/comments-create.component';
import { CommentsEditComponent } from './comments-edit/comments-edit.component';
import { CommentsListComponent } from './comments-list/comments-list.component';

import { MessagesCreateComponent } from './messages-create/messages-create.component';
import { MessagesEditComponent } from './messages-edit/messages-edit.component';
import { MessagesListComponent } from './messages-list/messages-list.component';

import { GroupsCreateComponent } from './groups-create/groups-create.component';
import { GroupsEditComponent } from './groups-edit/groups-edit.component';
import { GroupsListComponent } from './groups-list/groups-list.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersListComponent,
  },
  {
    path: 'users/edit/:id',
    component: UsersEditComponent,
  },
  {
    path: 'users/new',
    component: UsersCreateComponent,
  },

  {
    path: 'posts',
    component: PostsListComponent,
  },
  {
    path: 'posts/edit/:id',
    component: PostsEditComponent,
  },
  {
    path: 'posts/new',
    component: PostsCreateComponent,
  },

  {
    path: 'reaction',
    component: ReactionListComponent,
  },
  {
    path: 'reaction/edit/:id',
    component: ReactionEditComponent,
  },
  {
    path: 'reaction/new',
    component: ReactionCreateComponent,
  },

  {
    path: 'comments',
    component: CommentsListComponent,
  },
  {
    path: 'comments/edit/:id',
    component: CommentsEditComponent,
  },
  {
    path: 'comments/new',
    component: CommentsCreateComponent,
  },

  {
    path: 'messages',
    component: MessagesListComponent,
  },
  {
    path: 'messages/edit/:id',
    component: MessagesEditComponent,
  },
  {
    path: 'messages/new',
    component: MessagesCreateComponent,
  },

  {
    path: 'groups',
    component: GroupsListComponent,
  },
  {
    path: 'groups/edit/:id',
    component: GroupsEditComponent,
  },
  {
    path: 'groups/new',
    component: GroupsCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrudRoutingModule {}
