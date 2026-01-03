import { StructureInspector } from '../../src/core/StructureInspector';

describe('StructureInspector', () => {
    const data = {
        store: {
            book: [
                { category: 'reference', author: 'Nigel Rees', title: 'Sayings of the Century', price: 8.95 },
                { category: 'fiction', author: 'Evelyn Waugh', title: 'Sword of Honour', price: 12.99 }
            ],
            bicycle: { color: 'red', price: 19.95 }
        },
        nested: {
            deep: {
                value: 'hidden'
            }
        },
        array: ['a', 'b', 'c']
    };

    const inspector = new StructureInspector(data);

    describe('inspect', () => {
        it('should summarize structure at depth 1', () => {
            const summary = inspector.inspect(1);
            expect(summary).toEqual({
                store: 'object',
                nested: 'object',
                array: 'Array[3]'
            });
        });

        it('should summarize structure at depth 2', () => {
            const summary = inspector.inspect(2);
            expect(summary).toEqual({
                store: {
                    book: 'Array[2]',
                    bicycle: 'object'
                },
                nested: {
                    deep: 'object'
                },
                array: ['string', 'string', 'string']
            });
        });

        it('should summarize structure at depth 3', () => {
            const summary = inspector.inspect(3);
            expect(summary).toEqual({
                store: {
                    book: ['object', 'object'],
                    bicycle: { color: 'string', price: 'number' }
                },
                nested: {
                    deep: {
                        value: 'string'
                    }
                },
                array: ['a', 'b', 'c']
            });
        });
    });

    describe('summarize', () => {
        it('should return flat structure summary', () => {
            const summary = inspector.summarize();
            expect(summary).toContain('(root) = {store, nested, array}');
            expect(summary).toContain('store.book[*] = {category, author, title, price}');
            expect(summary).toContain('nested.deep = {value}');
        });
    });
});

