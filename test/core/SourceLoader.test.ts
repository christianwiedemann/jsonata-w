import { SourceLoader } from '../../src/core/SourceLoader';
import fs from 'fs';
import path from 'path';

describe('SourceLoader', () => {
    const tmpDir = path.join(__dirname, 'tmp_loader_test');
    const validJsonPath = path.join(tmpDir, 'valid.json');
    const invalidJsonPath = path.join(tmpDir, 'invalid.json');

    beforeAll(() => {
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        fs.writeFileSync(validJsonPath, JSON.stringify({ key: 'value' }));
        fs.writeFileSync(invalidJsonPath, '{ key: value }'); // Invalid JSON
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
});

