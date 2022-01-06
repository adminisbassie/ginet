//import {Users} from './users.model';
//import {Users} from './users.model';
//import {Users} from './users.model';

export class Messages {
  id: string;

    body: string

;

    from: any; // Users;

    to: any; // Users;

  createdBy: any; // Users;
  updatedBy: any; //Users;
}

export interface MessagesList {
  count: number;
  rows: Messages[];
}

