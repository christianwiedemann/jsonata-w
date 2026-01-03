import { JsonataTransformer } from '../../src/core/JsonataTransformer';
import fs from 'fs';
import path from 'path';

describe('JsonataTransformer', () => {
    const tmpDir = path.join(__dirname, 'tmp_jsonata_test');
    const exprFile = path.join(tmpDir, 'test.jsonata');

    beforeAll(() => {
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        fs.writeFileSync(exprFile, '{ "newKey": oldKey }');
    });

    afterAll(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    const transformer = new JsonataTransformer();

    it('should transform data using expression file', async () => {
        const input = { oldKey: 'value' };
        const result = await transformer.transform(input, exprFile);
        expect(result).toEqual({ newKey: 'value' });
    });

    it('should throw if expression file missing', async () => {
        await expect(transformer.transform({}, 'missing.jsonata')).rejects.toThrow(/Expression file not found/);
    });

    it('should evaluate expression string directly', async () => {
        const input = { oldKey: 'value' };
        const expression = '{ "direct": oldKey }';
        const result = await transformer.evaluate(input, expression);
        expect(result).toEqual({ direct: 'value' });
    });

    it('should ignore comments in expression (e.g. embedded config)', async () => {
        const input = { val: 1 };
        const expression = `
            /* 
            @config { "ignored": true }
            */
            { "res": val * 2 }
        `;
        const result = await transformer.evaluate(input, expression);
        expect(result).toEqual({ res: 2 });
    });
});
