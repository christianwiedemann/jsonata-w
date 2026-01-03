import { SchemaGenerator } from '../../src/core/SchemaGenerator';

describe('SchemaGenerator', () => {
    const generator = new SchemaGenerator();

    it('should generate schema for object', () => {
        const json = { name: 'John', age: 30 };
        const schema = generator.generate(json);
        expect(schema).toMatchObject({
            type: 'object',
            properties: {
                name: { type: 'string' },
                age: { type: 'integer' }
            }
        });
    });

    it('should generate schema for array', () => {
        const json = [{ name: 'John' }];
        const schema = generator.generate(json);
        expect(schema).toMatchObject({
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' }
                }
            }
        });
    });
});

