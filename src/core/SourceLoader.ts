import fs from 'fs';

export class SourceLoader {
    private cache: Map<string, any> = new Map();

    load(path: string): any {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }
        if (!fs.existsSync(path)) {
            throw new Error(`File not found: ${path}`);
        }
        const content = fs.readFileSync(path, 'utf-8');
        try {
            const json = JSON.parse(content);
            this.cache.set(path, json);
            return json;
        } catch (_e) {
            throw new Error(`Invalid JSON in file: ${path}`);
        }
    }

    clearCache() {
        this.cache.clear();
    }
}

