import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
} from "tsoa";
import { FileBackend } from "src/backend/backend-file";
import { Update } from "src/models/update";
import { Backend } from "src/backend/backend";

@Route("docSet")
export class DocSetController<T = any> extends Controller {
  constructor(
    private _backend: Backend = new FileBackend()
  ) {
    super();
  }

  @Get("{docSet}/doc/{id}")
  public get<D extends T = T>(
    @Path() docSet: string,
    @Path() id: string
  ): any | null {
    // TODO(r.chu): Implement security rules!
    
    return this._backend.get(docSet, id);
  }

  @Post("{docSet}/doc/{id}/update")
  public update<D extends T = T>(
    @Path() docSet: string,
    @Path() id: string,
    @Body() updates: Update[]
  ): any | null {
    // TODO(r.chu): Implement security rules!
    
    return this._backend.update(docSet, id, updates);
  }
}
