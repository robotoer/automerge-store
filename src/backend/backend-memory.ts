import path from "path";
import { Backend } from "./backend";
import { Doc, init, applyChanges } from "automerge";
import { Update } from "src/models/update";

export class MemoryBackend<T=any> implements Backend<T> {
  constructor(
    private readonly _data = new Map<string, Doc<T>>()
  ) {}

  public get<D extends T = T>(docSet: string, id: string): Doc<D> | null {
    if (!docSet || !id) {
      return null;
    }
    const docPath = path.join(docSet, id);

    return (this._data.get(docPath) as Doc<D>) || init<D>();
  }

  public update<D extends T = T>(docSet: string, id: string, updates: Update[]): Doc<D> | null {
    if (!docSet || !id) {
      return null;
    }
    const docPath = path.join(docSet, id);

    // Get the doc.
    let doc = (this._data.get(docPath) as Doc<D>) || init<D>();

    // Apply incoming updates.
    doc = applyChanges(doc, updates.map(update => update.change));
    this._data.set(docPath, doc);

    return doc;
  }
}
