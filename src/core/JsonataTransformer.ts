import jsonata from 'jsonata';
import fs from 'fs';

export class JsonataTransformer {
    async evaluate(json: any, expression: string): Promise<any> {
        const transformer = jsonata(expression);
        
        // Register custom bindings if needed (e.g. for logging)
        transformer.registerFunction('log', (arg) => {
            console.log(arg);
            return arg;
        });

        return transformer.evaluate(json);
    }

    async transform(json: any, expressionFile: string): Promise<any> {
        if (!fs.existsSync(expressionFile)) {
            throw new Error(`Expression file not found: ${expressionFile}`);
        }
        const expression = fs.readFileSync(expressionFile, 'utf-8');
        return this.evaluate(json, expression);
    }
}
