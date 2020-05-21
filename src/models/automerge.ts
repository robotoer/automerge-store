/**
 * The return type of `Automerge.init<T>()`, `Automerge.change<T>()`, etc. where `T` is the
 * original type. It is a recursively frozen version of the original type.
 */
export type Doc<T> = FreezeObject<T>

/**
 * The argument pased to the callback of a `change` function is a mutable proxy of the original
 * type. `Proxy<D>` is the inverse of `Doc<T>`: `Proxy<Doc<T>>` is `T`, and `Doc<Proxy<D>>` is `D`.
 */
export type Proxy<D> = D extends Doc<infer T> ? T : never


// custom CRDT types

export interface TableRow {
  readonly id: UUID
}

export interface Table<T> {
  add(item: T): UUID
  byId(id: UUID): T & TableRow
  count: number
  ids: UUID[]
  remove(id: UUID): void
  rows(): (T & TableRow)[]
}

export interface List<T> extends Array<T> {
  insertAt?(index: number, ...args: T[]): List<T>
  deleteAt?(index: number, numDelete?: number): List<T>
}

export interface Text extends List<string> {
  get(index: number): string
  getElemId(index: number): string
  toSpans<T>(): (string | T)[]
}

// Note that until https://github.com/Microsoft/TypeScript/issues/2361 is addressed, we
// can't treat a Counter like a literal number without force-casting it as a number.
// This won't compile:
//   `assert.strictEqual(c + 10, 13) // Operator '+' cannot be applied to types 'Counter' and '10'.ts(2365)`
// But this will:
//   `assert.strictEqual(c as unknown as number + 10, 13)`
export interface Counter extends Number {
  increment(delta?: number): void
  decrement(delta?: number): void
  toString(): string
  valueOf(): number
  value: number
}

// Readonly variants

export type ReadonlyTable<T> = ReadonlyArray<T> & Table<T>
export type ReadonlyList<T> = ReadonlyArray<T> & List<T>
export type ReadonlyText = ReadonlyList<string> & Text

// Internals

export type UUID = string
export type UUIDGenerator = () => UUID
export interface UUIDFactory extends UUIDGenerator {
  setFactory: (generator: UUIDGenerator) => void
  reset: () => void
}

export interface Message {
  docId: string
  clock: Clock
  changes?: Change[]
}

export interface Clock {
  [actorId: string]: number
}

export interface State<T> {
  change: Change
  snapshot: T
}

export interface Change {
  message?: string
  requestType?: RequestType
  actor: string
  seq: number
  deps: Clock
  ops: Op[]
  diffs?: Diff[]
}

export interface Op {
  action: OpAction
  obj: UUID
  key?: string
  value?: any
  datatype?: DataType
  elem?: number
}

export interface Patch {
  actor?: string
  seq?: number
  clock?: Clock
  deps?: Clock
  canUndo?: boolean
  canRedo?: boolean
  diffs: Diff[]
}

export interface Diff {
  action: DiffAction
  type: CollectionType
  obj: UUID
  path?: string[]
  key?: string
  index?: number
  value?: any
  elemId?: string
  conflicts?: Conflict[]
  datatype?: DataType
  link?: boolean
}

export interface Conflict {
  actor: string
  value: any
  link?: boolean
}

export type RequestType =
  | 'change' //..
  | 'redo'
  | 'undo'

export type OpAction =
  | 'ins'
  | 'del'
  | 'inc'
  | 'link'
  | 'set'
  | 'makeText'
  | 'makeTable'
  | 'makeList'
  | 'makeMap'

export type DiffAction =
  | 'create' //..
  | 'insert'
  | 'set'
  | 'remove'

export type CollectionType =
  | 'list' //..
  | 'map'
  | 'table'
  | 'text'

export type DataType =
  | 'counter' //..
  | 'timestamp'

// TYPE UTILITY FUNCTIONS

// Type utility function: Freeze
// Generates a readonly version of a given object, array, or map type applied recursively to the nested members of the root type.
// It's like TypeScript's `readonly`, but goes all the way down a tree.

// prettier-ignore
export type Freeze<T> =
  T extends Function ? T
  : T extends Text ? ReadonlyText
  : T extends Table<infer T> ? FreezeTable<T>
  : T extends List<infer T> ? FreezeList<T>
  : T extends Array<infer T> ? FreezeArray<T>
  : T extends Map<infer K, infer V> ? FreezeMap<K, V>
  : T extends string & infer O ? string & O
  : FreezeObject<T>

export interface FreezeTable<T> extends ReadonlyTable<Freeze<T>> {}
export interface FreezeList<T> extends ReadonlyList<Freeze<T>> {}
export interface FreezeArray<T> extends ReadonlyArray<Freeze<T>> {}
export interface FreezeMap<K, V> extends ReadonlyMap<Freeze<K>, Freeze<V>> {}
export type FreezeObject<T> = { readonly [P in keyof T]: Freeze<T[P]> }

export type Lookup<T, K> = K extends keyof T ? T[K] : never
