import { diff } from 'jest-diff';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

// Emulate the logic in CLI since we can't easily import the CLI script itself as a library
// This test validates the comparison logic and dependencies works as expected

describe('Validation Logic', () => {
    const validJsonPath = path.join(__dirname, '../fixtures/validation/valid.json');
    const mismatchJsonPath = path.join(__dirname, '../fixtures/validation/mismatch.json');
    const validYamlPath = path.join(__dirname, '../fixtures/validation/valid.yaml');

    const result = { key: 'value' };

    it('should pass for matching JSON', () => {
        const exampleContent = fs.readFileSync(validJsonPath, 'utf-8');
        const exampleData = JSON.parse(exampleContent);
        const difference = diff(exampleData, result);

        expect(difference).toContain('Compared values have no visual difference');
    });

    it('should fail for mismatching JSON', () => {
        const exampleContent = fs.readFileSync(mismatchJsonPath, 'utf-8');
        const exampleData = JSON.parse(exampleContent);
        const difference = diff(exampleData, result);

        expect(difference).not.toContain('Compared values have no visual difference');
        expect(difference).toContain('"key": "different"');
        expect(difference).toContain('"key": "value"');
    });

    it('should pass for matching YAML', () => {
        const exampleContent = fs.readFileSync(validYamlPath, 'utf-8');
        const exampleData = yaml.load(exampleContent);
        const difference = diff(exampleData, result);

        expect(difference).toContain('Compared values have no visual difference');
    });
});
