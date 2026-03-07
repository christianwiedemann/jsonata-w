import { SourceLoader } from '../../src/core/SourceLoader';
import fs from 'fs';
import path from 'path';

describe('SourceLoader', () => {
    const tmpDir = path.join(__dirname, 'tmp_loader_test');
    const validJsonPath = path.join(tmpDir, 'valid.json');
    const invalidJsonPath = path.join(tmpDir, 'invalid.json');
    const validYmlPath = path.join(tmpDir, 'valid.yml');
    const validYamlPath = path.join(tmpDir, 'valid.yaml');
    const invalidYmlPath = path.join(tmpDir, 'invalid.yml');

    beforeAll(() => {
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        fs.writeFileSync(validJsonPath, JSON.stringify({ key: 'value' }));
        fs.writeFileSync(invalidJsonPath, '{ key: value }'); // Invalid JSON
        fs.writeFileSync(validYmlPath, 'key: value\nnested:\n  foo: bar\n');
        fs.writeFileSync(validYamlPath, 'items:\n  - one\n  - two\n');
        fs.writeFileSync(invalidYmlPath, ':\n  - bad: yaml: broken: {{{\n');
    });

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should load valid JSON', () => {
        const loader = new SourceLoader();
        const json = loader.load(validJsonPath);
        expect(json).toEqual({ key: 'value' });
    });

    it('should throw on missing file', () => {
        const loader = new SourceLoader();
        expect(() => loader.load('nonexistent.json')).toThrow(/File not found/);
    });

    it('should throw on invalid JSON', () => {
        const loader = new SourceLoader();
        expect(() => loader.load(invalidJsonPath)).toThrow(/Invalid JSON/);
    });

    it('should cache loaded files', () => {
        const loader = new SourceLoader();
        const json1 = loader.load(validJsonPath);
        // Modify file on disk to prove cache is used
        fs.writeFileSync(validJsonPath, JSON.stringify({ key: 'modified' }));
        const json2 = loader.load(validJsonPath);
        expect(json2).toEqual(json1); // Should still be 'value'

        loader.clearCache();
        const json3 = loader.load(validJsonPath);
        expect(json3).toEqual({ key: 'modified' });
    });

    it('should load valid .yml file', () => {
        const loader = new SourceLoader();
        const data = loader.load(validYmlPath);
        expect(data).toEqual({ key: 'value', nested: { foo: 'bar' } });
    });

    it('should load valid .yaml file', () => {
        const loader = new SourceLoader();
        const data = loader.load(validYamlPath);
        expect(data).toEqual({ items: ['one', 'two'] });
    });

    it('should throw on invalid YAML with correct error message', () => {
        const loader = new SourceLoader();
        expect(() => loader.load(invalidYmlPath)).toThrow(/Invalid YAML/);
    });

    it('should throw on missing YAML file', () => {
        const loader = new SourceLoader();
        expect(() => loader.load('nonexistent.yml')).toThrow(/File not found/);
    });

    it('should cache YAML files', () => {
        const loader = new SourceLoader();
        const data1 = loader.load(validYmlPath);
        fs.writeFileSync(validYmlPath, 'key: changed\n');
        const data2 = loader.load(validYmlPath);
        expect(data2).toEqual(data1); // Should still be original

        loader.clearCache();
        const data3 = loader.load(validYmlPath);
        expect(data3).toEqual({ key: 'changed' });
    });
});

