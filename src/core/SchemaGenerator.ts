import toJsonSchema from 'to-json-schema';

export class SchemaGenerator {
    generate(json: any): any {
        return toJsonSchema(json, {
            objects: {
                postProcessFnc: (schema, obj, defaultFnc) => {
                    return defaultFnc(schema, obj);
                }
            },
            arrays: {
                mode: 'first' // or 'all' or 'uniform'
            }
        });
    }
}

