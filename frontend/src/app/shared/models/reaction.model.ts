//import {Users} from './users.model';
//import {Users} from './users.model';
//import {Posts} from './posts.model';

export class Reaction {
  id: string;

  name: any;

  user: any; // Users;

  post: any; // Posts;

  createdBy: any; // Users;
  updatedBy: any; //Users;
}

export interface ReactionList {
  count: number;
  rows: Reaction[];
}
