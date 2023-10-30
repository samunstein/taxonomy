interface ChartValues {
    _upToTheRootHighlighted?: boolean;
    _highlighted?: boolean;
    _centered?: boolean;
}

export interface NodeData extends ChartValues {
    readonly name: string;
    readonly description: string;
    readonly id: number;
    readonly parentId: number | null;
    toggled?: boolean;
}

export type NodeOrdering = number[];

function minus1IsInf(arr: NodeOrdering): NodeOrdering {
    return arr.map(v => v === -1 ? 1000000 : v) as NodeOrdering;
}

function insensitive(s: string): string {
    return s.toLowerCase()
}

export function getOrdering(node: NodeData, search: string): NodeOrdering {
    let searches = [];
    if (search.includes(" ")) {
        searches = [search, ...search.split(/\s+/)];
    } else {
        searches = [search];
    }
    searches = searches.map(insensitive);

    let ordering: NodeOrdering = [];

    const attributes: string[] = [node.name, node.description].map(insensitive);

    searches.forEach(term => {
        attributes.forEach(attr => {
            if (attr === term) ordering.push(-2);
            else ordering.push(attr.indexOf(term));
        });
    });

    return minus1IsInf(ordering);
}

export function order(a: NodeOrdering, b: NodeOrdering) {
    let i = 0;
    let diff = 0;
    while (i < a.length && diff === 0) {
        diff = a[i] - b[i];
        i++;
    }
    return diff;
}