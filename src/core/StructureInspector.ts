export class StructureInspector {
    constructor(private json: any) {}

    inspect(depth: number = 1): any {
        const summarize = (obj: any, currentDepth: number): any => {
            if (currentDepth > depth) {
                if (Array.isArray(obj)) return `Array[${obj.length}]`;
                return typeof obj;
            }

            if (Array.isArray(obj)) {
                 return obj.map(item => summarize(item, currentDepth + 1));
            }

            if (typeof obj === 'object' && obj !== null) {
                const summary: any = {};
                for (const key in obj) {
                    summary[key] = summarize(obj[key], currentDepth + 1);
                }
                return summary;
            }
            return obj;
        };
        return summarize(this.json, 1);
    }

    summarize(): string[] {
        const paths = new Map<string, Set<string>>();

        const addKeys = (path: string, keys: string[]) => {
            if (!paths.has(path)) paths.set(path, new Set());
            keys.forEach(k => paths.get(path)!.add(k));
        };

        const traverse = (obj: any, currentPath: string) => {
            if (Array.isArray(obj)) {
                if (obj.length > 0) {
                    const limit = Math.min(obj.length, 5); 
                    for (let i = 0; i < limit; i++) {
                        const item = obj[i];
                        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                            const keys = Object.keys(item);
                            const itemPath = currentPath + '[*]';
                            addKeys(itemPath, keys);
                            keys.forEach(k => traverse(item[k], itemPath === '' ? k : `${itemPath}.${k}`));
                        } else if (Array.isArray(item)) {
                            traverse(item, currentPath + '[*]');
                        }
                    }
                }
            } else if (typeof obj === 'object' && obj !== null) {
                const keys = Object.keys(obj);
                if (currentPath === '') {
                    addKeys('(root)', keys);
                } else {
                     addKeys(currentPath, keys);
                }
                keys.forEach(k => traverse(obj[k], currentPath === '' ? k : `${currentPath}.${k}`));
            }
        };

        traverse(this.json, '');

        const result: string[] = [];
        const sortedPaths = Array.from(paths.keys()).sort();
        
        sortedPaths.forEach(path => {
            const keys = paths.get(path);
            if (keys && keys.size > 0) {
                 const keyList = Array.from(keys).join(', ');
                 result.push(`${path} = {${keyList}}`);
            }
        });
        return result;
    }
}



