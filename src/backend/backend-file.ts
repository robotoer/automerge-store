import fs from "fs";
import path from "path";
import LRUCache from "lru-cache";
import { Backend } from "./backend";
import { Doc, load, init, applyChanges, save } from "automerge";
import { Update } from "src/models/update";

export class FileBackend<T=any> implements Backend<T> {
  private readonly _cache = new LRUCache<string, Doc<T>>({max: 100});

  constructor(
    public readonly dataPath: string = '.automerge-db-data'
  ) {}

  public get<D extends T = T>(docSet: string, id: string): Doc<D> | null {
    if (!docSet || !id) {
      return null;
    }
    const docPath = path.join(this.dataPath, docSet, id);

    if (!this._cache.has(docPath)) {
      const data = fs.readFileSync(docPath);
      const loaded = load<D>(data.toString());
      this._cache.set(docPath, loaded);
      return loaded;
    } else {
      return (this._cache.get(docPath) as Doc<D>) || null;
    }
  }

  public update<D extends T = T>(docSet: string, id: string, updates: Update[]): Doc<D> | null {
    if (!docSet || !id) {
      return null;
    }
    const docPath = path.join(this.dataPath, docSet, id);

    // Get the doc.
    let doc = this._cache.get(docPath) as Doc<D>;
    if (!doc) {
      try {
        const docRaw = fs.readFileSync(docPath);
        doc = load<D>(docRaw.toString());
      } catch (err) {
        if (err.code === 'ENOENT') {
          doc = init<D>();
        } else {
          throw err;
        }
      }
    }

    // Apply incoming updates.
    doc = applyChanges(doc, updates.map(update => update.change));

    // Save the updated document.
    const saved = save(doc);
    fs.writeFileSync(docPath, saved)

    return doc;
  }
}
