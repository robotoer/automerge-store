import { Change } from "./automerge";

export interface Update {
  id: string;

  action: any;
  change: Change;
  message: string;
}
