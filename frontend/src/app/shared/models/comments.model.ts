//import {Users} from './users.model';
//import {Posts} from './posts.model';
//import {Users} from './users.model';

export class Comments {
  id: string;

    content: string

;

    post: any; // Posts;

    author: any; // Users;

  createdBy: any; // Users;
  updatedBy: any; //Users;
}

export interface CommentsList {
  count: number;
  rows: Comments[];
}

