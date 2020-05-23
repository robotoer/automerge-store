import path from "path";
import { expect } from "chai";
import { from, Doc, change, getChanges } from "automerge";
import { MemoryBackend } from "../../src/backend/backend-memory";
import { DocSetController } from "../../src/controllers/docSetController";
import * as uuid from "uuid";

interface TestData {
  field1: number;
  field2: string;
  field3: boolean;
}

describe('docSetController', () => {
  const docSet = 'test-docset';
  const doc1Key = path.join(docSet, 'id1');
  const doc2Key = path.join(docSet, 'id2');
  const doc3Key = path.join(docSet, 'id3');
  const doc1Orig = from({field1: 3, field2: 'hello', field3: false});
  const doc2Orig = from({field1: 2, field2: 'world', field3: true});
  const doc3Orig = from({field1: 33, field2: 'foo', field3: false});

  it('gets saved documents correctly', () => {
    const docSet = 'test-docset';
    const documents = new Map<string, Doc<TestData>>();
    documents.set(doc1Key, doc1Orig);
    documents.set(doc2Key, doc2Orig);
    documents.set(doc3Key, doc3Orig);
    const backend = new MemoryBackend(documents);
    const controller = new DocSetController(backend as any);

    const result = controller.get(docSet, 'id2');
    expect(result).to.not.be.null;
    if (result) {
      expect(result.field1).to.equal(2);
      expect(result.field2).to.equal('world');
      expect(result.field3).to.equal(true);
    }
  });

  it('updates saved documents correctly', async () => {
    const docSet = 'test-docset';
    const documents = new Map<string, Doc<TestData>>();
    documents.set(doc1Key, doc1Orig);
    documents.set(doc2Key, doc2Orig);
    documents.set(doc3Key, doc3Orig);
    const backend = new MemoryBackend(documents);
    const controller = new DocSetController(backend as any);

    const doc2 = controller.get(docSet, 'id2');
    expect(doc2).to.not.be.null;
    if (doc2) {
      const newDoc2 = change<any, any>(doc2, doc => {
        doc.field2 = 'changed';
      });
      const changes = getChanges(doc2, newDoc2);

      controller.update(docSet, 'id2', [
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

  it('gets new documents correctly', () => {
    const docSet = 'test-docset';
    const backend = new MemoryBackend();
    const controller = new DocSetController(backend as any);

    const result = controller.get(docSet, 'id2');
    expect(result).to.not.be.null;
    if (result) {
      expect(result.field1).to.be.undefined;
      expect(result.field2).to.be.undefined;
      expect(result.field3).to.be.undefined;
    }
  });

  it('updates new documents correctly', async () => {
    const docSet = 'test-docset';
    const documents = new Map<string, Doc<TestData>>();
    const backend = new MemoryBackend(documents);
    const controller = new DocSetController(backend as any);

    const doc2 = controller.get(docSet, 'id2');
    expect(doc2).to.not.be.null;
    if (doc2) {
      const newDoc2 = change<any, any>(doc2, doc => {
        doc.field2 = 'changed';
      });
      const changes = getChanges(doc2, newDoc2);

      controller.update(docSet, 'id2', [
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
