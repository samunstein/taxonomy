import { OrgChart } from '../d3-org-chart';
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

export function toggle(chart: OrgChart, node: NodeData) {
    node.toggled = !node.toggled;
    chart.render();
}

export function getNodeComponentRender(chart: OrgChart) {
    function nodeComponent(d: HierarchyNode<NodeData>): JSX.Element {
        return (
        <div onClick={(_) => toggle(chart, d.data)} className={d.data.toggled ? 'node toggled' : (d.data._highlighted || d.data._upToTheRootHighlighted ? 'node highlighted' : 'node')}>
            <div className='node-rank'>{d.data.rank}</div>
            <div className='node-names'>
              {d.data.name ? <div className='node-name'>{d.data.name}</div> : <></>}
              <div className='node-sci-name'>{d.data.scientific_name}</div>
            </div>
        </div>
        );
    }
    return nodeComponent;
}


export function configureChart(chart: OrgChart, renderNode: (node: HierarchyNode<NodeData>) => JSX.Element): OrgChart {
    return (chart as any)
        .nodeWidth((_: any) => NODE_WIDTH)
        .nodeHeight((_: any) => NODE_HEIGHT)
        .compact(false)
        .linkYOffset(0)
        .nodeContent(() => `<div class="org-chart-node" style="height: ${NODE_HEIGHT}px"></div>`)
        .nodeUpdate(function (this: HTMLElement, d: any) {
          const container = this.querySelector(".org-chart-node")!;
          const root = createRoot(container);
          const reactNode = renderNode(d as unknown as HierarchyNode<NodeData>);
          root.render(reactNode);
        })
        .svgHeight(window.innerHeight - 20)
        .linkUpdate(function (d: any, i: any, arr: any) {
            d3.select(this)
              .attr('stroke', (d: any) =>
                d.data._upToTheRootHighlighted ? '#0089a8' : '#000000'
              )
              .attr('stroke-width', (d: any) =>
                d.data._upToTheRootHighlighted ? 6 : 2
              );

            if (d.data._upToTheRootHighlighted) {
              d3.select(this).raise();
            }
          });
}
