import { parse } from 'comment-parser';
import { TransformConfig } from './TransformConfig';

export class ConfigParser {
    static extract(content: string): TransformConfig {
        const blocks = parse(content);

        for (const block of blocks) {
            const configTag = block.tags.find(tag => tag.tag === 'config');
            if (configTag) {
                // Reconstruct the raw content from the source tokens to bypass JSDoc type parsing (which eats braces)
                const rawContent = configTag.source.map((line, index) => {
                    const t = line.tokens;
                    if (index === 0) {
                        // First line: skip tag
                        return (t.postTag || '') + (t.name || '') + (t.postName || '') + (t.type || '') + (t.postType || '') + (t.description || '');
                    } else {
                        // Subsequent lines: take everything after delimiter
                        // Note: postDelimiter is usually the space after *, but we might want it for indentation
                        return (t.postDelimiter || '') + (t.tag || '') + (t.postTag || '') + (t.name || '') + (t.postName || '') + (t.type || '') + (t.postType || '') + (t.description || '');
                    }
                }).join('\n');

                try {
                    return JSON.parse(rawContent);
                } catch (_e) {
                    throw new Error('Invalid JSON in @config block');
                }
            }
        }

        throw new Error('No @config block found in JSONata file. usage: /* @config { "input": "...", "output": "..." } */');
    }
}

