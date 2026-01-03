import { ConfigParser } from '../../src/core/ConfigParser';

describe('ConfigParser', () => {
    it('should extract valid config', () => {
        const content = `
/**
 * @config {
 *     "input": "in.json",
 *     "output": "out.json"
 * }
 */
$merged := ...
`;
        const config = ConfigParser.extract(content);
        expect(config).toEqual({
            input: "in.json",
            output: "out.json"
        });
    });

    it('should throw if no config block', () => {
        const content = '$merged := ...';
        expect(() => ConfigParser.extract(content)).toThrow(/No @config block found/);
    });

    it('should throw if invalid JSON', () => {
        const content = `
/** @config { "input": "in.json", } */
`;
        expect(() => ConfigParser.extract(content)).toThrow(/Invalid JSON/);
    });

    it('should handle single line config', () => {
        const content = '/** @config { "input": "in.json", "output": "out.json" } */\n$expression';
        const config = ConfigParser.extract(content);
        expect(config).toEqual({
            input: "in.json",
            output: "out.json"
        });
    });
});

