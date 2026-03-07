import Ajv from 'ajv';
import fs from 'fs';
import yaml from 'js-yaml';

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
            const isYaml = schemaPath.endsWith('.yml') || schemaPath.endsWith('.yaml');
            schema = isYaml ? yaml.load(schemaContent) : JSON.parse(schemaContent);
        } catch (_e) {
            const format = (schemaPath.endsWith('.yml') || schemaPath.endsWith('.yaml')) ? 'YAML' : 'JSON';
            throw new Error(`Invalid ${format} schema in file: ${schemaPath}`);
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

