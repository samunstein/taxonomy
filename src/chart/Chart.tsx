import { OrgChart } from 'd3-org-chart';
import './Chart.css';

import { select } from "d3-selection";
import { HierarchyNode } from 'd3';
import { createRoot } from 'react-dom/client';
import { NodeData } from '../NodeData';

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 120;

const d3 = {
    select
}

export function toggle(chart: OrgChart<NodeData>, node: NodeData) {
    node.toggled = !node.toggled;
    chart.render();
}

export function getNodeComponentRender(chart: OrgChart<NodeData>) {
    function nodeComponent(d: HierarchyNode<NodeData>): JSX.Element {
        return (
        <div className={d.data.toggled ? 'node toggled' : (d.data._highlighted || d.data._upToTheRootHighlighted ? 'node highlighted' : 'node')}>
            <div className='node-header'>
                {d.data.scientific_name}
            </div>
            <div className='node-content'>
                {d.data.name}
            </div>
            <button onClick={_ => toggle(chart, d.data)}>Toggle</button>
        </div>
        );
    }
    return nodeComponent;
}


export function configureChart(chart: OrgChart<NodeData>, nodeClick: (node: NodeData) => void, renderNode: (node: HierarchyNode<NodeData>) => JSX.Element): OrgChart<NodeData> {
    return chart
        .nodeWidth((_) => NODE_WIDTH)
        .nodeHeight((_) => NODE_HEIGHT)
        .onNodeClick((node) => {
            nodeClick(node.data);
        })
        .compact(false)
        .linkYOffset(0)
        .nodeContent(() => `<div class="org-chart-node" style="height: ${NODE_HEIGHT}px"></div>`)
        .nodeUpdate(function (this: HTMLElement, d) {

            
          const container = this.querySelector(".org-chart-node")!;
          const root = createRoot(container);
          const reactNode = renderNode(d as unknown as HierarchyNode<NodeData>);
          root.render(reactNode);
        })
        .svgHeight(window.innerHeight - 20)
        .linkUpdate(function (d: any, i, arr) {
            d3.select(this)
              .attr('stroke', (d: any) =>
                d.data._upToTheRootHighlighted ? '#a87b00' : '#000000'
              )
              .attr('stroke-width', (d: any) =>
                d.data._upToTheRootHighlighted ? 6 : 1
              );

            if (d.data._upToTheRootHighlighted) {
              d3.select(this).raise();
            }
          });
}
