//import {Users} from './users.model';
//import {Groups} from './groups.model';

export class Posts {
  id: string;

    title: string

;

    content: string

;

    group: any; // Groups;

    images: any[];

  createdBy: any; // Users;
  updatedBy: any; //Users;
}

export interface PostsList {
  count: number;
  rows: Posts[];
}

