import fs from "fs";
import path from "path";
import { expect } from "chai";
import { FileBackend } from "../../src/backend/backend-file";
import { Doc, from, getChanges, change, save } from "automerge";
import * as uuid from "uuid";
import LRUCache from "lru-cache";
import { afterEach, beforeEach } from "mocha";

interface TestData {
  field1: number;
  field2: string;
  field3: boolean;
}

describe('backend-file with data', () => {
  const docSet = 'test-docset';
  const doc1Key = path.join(docSet, 'id1');
  const doc2Key = path.join(docSet, 'id2');
  const doc3Key = path.join(docSet, 'id3');
  const docSetPath = path.join('.automerge-db-test-data', docSet);
  const doc1Path = path.join('.automerge-db-test-data', doc1Key);
  const doc2Path = path.join('.automerge-db-test-data', doc2Key);
  const doc3Path = path.join('.automerge-db-test-data', doc3Key);
  const doc1Orig = from({field1: 3, field2: 'hello', field3: false});
  const doc2Orig = from({field1: 2, field2: 'world', field3: true});
  const doc3Orig = from({field1: 33, field2: 'foo', field3: false});

  beforeEach(() => {
    fs.mkdirSync(docSetPath, {recursive: true});
    fs.writeFileSync(doc1Path, save(doc1Orig));
    fs.writeFileSync(doc2Path, save(doc2Orig));
    fs.writeFileSync(doc3Path, save(doc3Orig));
  });

  afterEach(() => {
    fs.rmdirSync(".automerge-db-test-data", {recursive: true});
  });

  it('gets saved documents correctly', () => {
    const documents = new LRUCache<string, Doc<TestData>>();
    documents.set(doc1Key, doc1Orig);
    documents.set(doc2Key, doc2Orig);
    documents.set(doc3Key, doc3Orig);
    const backend = new FileBackend(documents, ".automerge-db-test-data");

    const result = backend.get(docSet, 'id2');
    expect(result).to.not.be.null;
    if (result) {
      expect(result.field1).to.equal(2);
      expect(result.field2).to.equal('world');
      expect(result.field3).to.equal(true);
    }
  });

  it('updates saved documents correctly', async () => {
    const docSet = 'test-docset';
    const documents = new LRUCache<string, Doc<TestData>>();
    documents.set(doc1Key, doc1Orig);
    documents.set(doc2Key, doc2Orig);
    documents.set(doc3Key, doc3Orig);
    const backend = new FileBackend(documents, ".automerge-db-test-data");

    const doc2 = backend.get(docSet, 'id2');
    expect(doc2).to.not.be.null;
    if (doc2) {
      const newDoc2 = change(doc2, doc => {
        doc.field2 = 'changed';
      });
      const changes = getChanges(doc2, newDoc2);

      backend.update(docSet, 'id2', [
        {
          id: uuid.v4(),
          message: '',
          change: changes[0],
          action: null
        }
      ]);
      const result = backend.get(docSet, 'id2');
      expect(result).to.not.be.null;
      if (result) {
        expect(result.field1).to.equal(2);
        expect(result.field2).to.equal('changed');
        expect(result.field3).to.equal(true);
      }
    }
  });
});

describe('backend-file without data', () => {
  afterEach(() => {
    fs.rmdirSync(".automerge-db-test-data", {recursive: true});
  });

  it('gets new documents correctly', () => {
    const docSet = 'test-docset';
    const backend = new FileBackend(new LRUCache<string, Doc<TestData>>({max: 100}), ".automerge-db-test-data");

    const result = backend.get(docSet, 'id2');
    expect(result).to.not.be.null;
    if (result) {
      expect(result.field1).to.be.undefined;
      expect(result.field2).to.be.undefined;
      expect(result.field3).to.be.undefined;
    }
  });

  it('updates new documents correctly', async () => {
    const docSet = 'test-docset';
    const backend = new FileBackend(new LRUCache<string, Doc<TestData>>({max: 100}), ".automerge-db-test-data");

    const doc2 = backend.get(docSet, 'id2');
    expect(doc2).to.not.be.null;
    if (doc2) {
      const newDoc2 = change(doc2, doc => {
        doc.field2 = 'changed';
      });
      const changes = getChanges(doc2, newDoc2);

      backend.update(docSet, 'id2', [
        {
          id: uuid.v4(),
          message: '',
          change: changes[0],
          action: null
        }
      ]);
      const result = backend.get(docSet, 'id2');
      expect(result).to.not.be.null;
      if (result) {
        expect(result.field1).to.be.undefined;
        expect(result.field2).to.equal('changed');
        expect(result.field3).to.be.undefined;
      }
    }
  });
});
