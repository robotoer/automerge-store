/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DocSetController } from './../src/controllers/docSetController';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "RequestType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["change"] }, { "dataType": "enum", "enums": ["redo"] }, { "dataType": "enum", "enums": ["undo"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Clock": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": { "dataType": "double" },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OpAction": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["ins"] }, { "dataType": "enum", "enums": ["del"] }, { "dataType": "enum", "enums": ["inc"] }, { "dataType": "enum", "enums": ["link"] }, { "dataType": "enum", "enums": ["set"] }, { "dataType": "enum", "enums": ["makeText"] }, { "dataType": "enum", "enums": ["makeTable"] }, { "dataType": "enum", "enums": ["makeList"] }, { "dataType": "enum", "enums": ["makeMap"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UUID": {
        "dataType": "refAlias",
        "type": { "dataType": "string", "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DataType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["counter"] }, { "dataType": "enum", "enums": ["timestamp"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Op": {
        "dataType": "refObject",
        "properties": {
            "action": { "ref": "OpAction", "required": true },
            "obj": { "ref": "UUID", "required": true },
            "key": { "dataType": "string" },
            "value": { "dataType": "any" },
            "datatype": { "ref": "DataType" },
            "elem": { "dataType": "double" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DiffAction": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["create"] }, { "dataType": "enum", "enums": ["insert"] }, { "dataType": "enum", "enums": ["set"] }, { "dataType": "enum", "enums": ["remove"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CollectionType": {
        "dataType": "refAlias",
        "type": { "dataType": "union", "subSchemas": [{ "dataType": "enum", "enums": ["list"] }, { "dataType": "enum", "enums": ["map"] }, { "dataType": "enum", "enums": ["table"] }, { "dataType": "enum", "enums": ["text"] }], "validators": {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Conflict": {
        "dataType": "refObject",
        "properties": {
            "actor": { "dataType": "string", "required": true },
            "value": { "dataType": "any", "required": true },
            "link": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Diff": {
        "dataType": "refObject",
        "properties": {
            "action": { "ref": "DiffAction", "required": true },
            "type": { "ref": "CollectionType", "required": true },
            "obj": { "ref": "UUID", "required": true },
            "path": { "dataType": "array", "array": { "dataType": "string" } },
            "key": { "dataType": "string" },
            "index": { "dataType": "double" },
            "value": { "dataType": "any" },
            "elemId": { "dataType": "string" },
            "conflicts": { "dataType": "array", "array": { "ref": "Conflict" } },
            "datatype": { "ref": "DataType" },
            "link": { "dataType": "boolean" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Change": {
        "dataType": "refObject",
        "properties": {
            "message": { "dataType": "string" },
            "requestType": { "ref": "RequestType" },
            "actor": { "dataType": "string", "required": true },
            "seq": { "dataType": "double", "required": true },
            "deps": { "ref": "Clock", "required": true },
            "ops": { "dataType": "array", "array": { "ref": "Op" }, "required": true },
            "diffs": { "dataType": "array", "array": { "ref": "Diff" } },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Update": {
        "dataType": "refObject",
        "properties": {
            "id": { "dataType": "string", "required": true },
            "action": { "dataType": "any", "required": true },
            "change": { "ref": "Change", "required": true },
            "message": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get('/docSet/:docSet/doc/:id',
        function(request: any, response: any, next: any) {
            const args = {
                docSet: { "in": "path", "name": "docSet", "required": true, "dataType": "string" },
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new DocSetController();


            const promise = controller.get.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/docSet/:docSet/doc/:id/update',
        function(request: any, response: any, next: any) {
            const args = {
                docSet: { "in": "path", "name": "docSet", "required": true, "dataType": "string" },
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                updates: { "in": "body", "name": "updates", "required": true, "dataType": "array", "array": { "ref": "Update" } },
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new DocSetController();


            const promise = controller.update.apply(controller, validatedArgs as any);
            promiseHandler(controller, promise, response, next);
        });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (isController(controllerObj)) {
                    const headers = controllerObj.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controllerObj.getStatus();
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
                    data.pipe(response);
                } else if (data || data === false) { // === false allows boolean result
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => next(error));
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any): any[] {
        const fieldErrors: FieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
            }
        });

        if (Object.keys(fieldErrors).length > 0) {
            throw new ValidateError(fieldErrors, '');
        }
        return values;
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
