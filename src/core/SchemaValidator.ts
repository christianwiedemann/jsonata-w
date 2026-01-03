import Ajv from 'ajv';
import fs from 'fs';

export class SchemaValidator {
    private ajv: Ajv;

    constructor() {
        this.ajv = new Ajv();
    }

    validate(data: any, schemaPath: string): { valid: boolean; errors?: any[] } {
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Schema file not found: ${schemaPath}`);
        }
        const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
        let schema;
        try {
            schema = JSON.parse(schemaContent);
        } catch (_e) {
            throw new Error(`Invalid JSON schema in file: ${schemaPath}`);
        }

        const validate = this.ajv.compile(schema);
        const valid = validate(data);

        if (!valid) {
            return {
                valid: false,
                errors: validate.errors || []
            };
        }

        return { valid: true };
    }
}

