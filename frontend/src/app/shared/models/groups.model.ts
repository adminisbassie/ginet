//import {Users} from './users.model';

export class Groups {
  id: string;

    name: string

;

    description: string

;

    images: any[];

  createdBy: any; // Users;
  updatedBy: any; //Users;
}

export interface GroupsList {
  count: number;
  rows: Groups[];
}

