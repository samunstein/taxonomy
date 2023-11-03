import { OrgChart } from '../d3-org-chart';
import { NODE_HEIGHT, NODE_WIDTH } from '../chart/Chart';
import './Buttons.css';
import { HierarchyNode } from 'd3';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { NodeData, NodeOrdering, getOrdering, order } from '../NodeData';

export function ButtonsComponent(props: {chart: OrgChart, data: NodeData[]}) {
    const [rawSearchValue, setSearchValue] = useState("");
    const [searchValue] = useDebounce(rawSearchValue, 500);
    const [searchedValues, setSearchedValues] = useState<NodeData[]>([]);

    useEffect(() => {
        setSearchedValues(searchResults(searchValue))
    }, [searchValue])

    function highlightToClosestAncestor(_: React.MouseEvent<HTMLButtonElement, MouseEvent>) {        
        const toggled = props.chart.clearHighlighting().getChartState().allNodes?.filter((d: any) => d.data.toggled);
        toggled?.forEach((node: any) => props.chart.setUpToTheRootHighlighted(node.data.id));

        if (toggled?.length) {
            // Start from root and de-highlight while only one child is highlighted,
            // meaning there is still some closer common ancestor remaining.
            const toggledIds = toggled.map((n: any) => n.data.id);
            let node = props.chart.getChartState().root;

            while (node.children?.filter((n: any) => n.data._highlighted || n.data._upToTheRootHighlighted).length === 1 && !toggledIds.includes(node.data.id)) {
                node.data._highlighted = false;
                node.data._upToTheRootHighlighted = false;
                node = node.children.find((n: any) => n.data._highlighted || n.data._upToTheRootHighlighted) as HierarchyNode<NodeData>;
            }
            node.data._upToTheRootHighlighted = false;
            node.data._highlighted = true;

            toggled.push(node);

            const y0 = (node as any).y as number - NODE_HEIGHT / 2;
            const x0 = Math.min(...toggled.map((n: any) => n.x)) - NODE_WIDTH;
            const x1 = Math.max(...toggled.map((n: any) => n.x)) + NODE_WIDTH;
            const y1 = Math.max(...toggled.map((n: any) => n.y)) + NODE_HEIGHT * 3/2;

            props.chart.zoomTreeBounds({x0, x1, y0, y1, params: {
                animate: true,
                scale: true,
                onCompleted: () => null
            }});

            props.chart.render();
        }
    }

    function clearChoices(_: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        props.chart.getChartState().allNodes?.forEach((d: any) => {
            d.data.toggled = false;
        });
        props.chart.clearHighlighting().render();
    }

    function searchTextChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setSearchValue(value);
    };

    function searchResults(search: string): NodeData[] {
        if (search.length < 3) return [];
        const withOrdering = props.chart.getChartState().data?.map((n: any) => [n, getOrdering(n, search)]) as [NodeData, NodeOrdering][];
        const sorted = withOrdering?.filter(([_, ordering]) => Math.min(...ordering) < Infinity);
        sorted.sort((a, b) => order(a[1], b[1]));
        return sorted.map(([node, _]) => node).slice(0, 10);
    }

    function goToNode(node: NodeData) {
        // Needs 2 renders because the first one makes the node visible, and only after that _centered does something.
        // Or something like that. IDK. This just works.
        props.chart.setCentered(node.id).render();
        props.chart.render();
    }

    return (
        <div className='buttons'>
            <button onClick={highlightToClosestAncestor}>Highlight to ancestor</button>
            <button onClick={clearChoices}>Clear choices</button>
            <div>
                <span>Search for node: </span>
                <input type='text' id='search' onChange={searchTextChange}></input>
            </div>
            
            <div className='search-results'>
                {searchedValues.map(node => 
                    <div key={node.id} className='search-result'>
                        <div className='search-info'>
                            <div className='search-sci-name'>{node.scientific_name} ({node.rank})</div>
                            {node.name ? <div className='search-name'>{node.name}</div> : <></>}
                        </div>
                        <button onClick={_ => goToNode(node)}>Find</button>
                    </div>
                    
                )}
            </div>
        </div>
    )
}