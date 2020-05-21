import { Doc } from "automerge";
import { Update } from "src/models/update";

export interface Backend<T=any> {
  // set<T=any>(docSet: string, doc: Doc<T>): void;
  get<D extends T = T>(docSet: string, id: string): Doc<D> | null;
  update<D extends T = T>(docSet: string, id: string, updates: Update[]): Doc<D> | null;
}
