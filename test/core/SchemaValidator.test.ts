import { SchemaValidator } from '../../src/core/SchemaValidator';
import fs from 'fs';
import path from 'path';

describe('SchemaValidator', () => {
    const tmpDir = path.join(__dirname, 'tmp_validator_test');
    const schemaPath = path.join(tmpDir, 'schema.json');
    const invalidSchemaPath = path.join(tmpDir, 'invalid_schema.json');

    beforeAll(() => {
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        const schema = {
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'number' }
            },
            required: ['name']
        };
        fs.writeFileSync(schemaPath, JSON.stringify(schema));
        fs.writeFileSync(invalidSchemaPath, '{ type: object }');
    });

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    const validator = new SchemaValidator();

    it('should validate correct data', () => {
        const result = validator.validate({ name: 'John', age: 30 }, schemaPath);
        expect(result.valid).toBe(true);
    });

    it('should fail on invalid data type', () => {
        const result = validator.validate({ name: 'John', age: '30' }, schemaPath);
        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
    });

    it('should fail on missing required property', () => {
        const result = validator.validate({ age: 30 }, schemaPath);
        expect(result.valid).toBe(false);
    });

    it('should throw if schema file missing', () => {
        expect(() => validator.validate({}, 'missing.json')).toThrow(/Schema file not found/);
    });

    it('should throw if schema is invalid JSON', () => {
        expect(() => validator.validate({}, invalidSchemaPath)).toThrow(/Invalid JSON schema/);
    });
});

