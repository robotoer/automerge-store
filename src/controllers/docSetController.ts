import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
} from "tsoa";

// Must be a relative-path import for tsoa.
import { FileBackend } from "../backend/backend-file";
import { Backend } from "../backend/backend";
import { Update } from "../models/update";

@Route("docSet")
export class DocSetController extends Controller {
  constructor(
    private _backend: Backend = new FileBackend()
  ) {
    super();
  }

  @Get("{docSet}/doc/{id}")
  public get(
    @Path() docSet: string,
    @Path() id: string
  ): any | null {
    // TODO(r.chu): Implement security rules!
    
    return this._backend.get(docSet, id);
  }

  @Post("{docSet}/doc/{id}/update")
  public update(
    @Path() docSet: string,
    @Path() id: string,
    @Body() updates: Update[]
  ): any | null {
    // TODO(r.chu): Implement security rules!
    
    return this._backend.update(docSet, id, updates);
  }
}
