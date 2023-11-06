import { OrgChart } from '../d3-org-chart';
import './Chart.css';

import { select } from "d3-selection";
import { HierarchyNode } from 'd3';
import { createRoot } from 'react-dom/client';
import { NodeData } from '../NodeData';

export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 140;

const d3 = {
    select
}

export function toggle(chart: OrgChart, node: NodeData) {
    node.toggled = !node.toggled;
    chart.render();
}

function goToParent(chart: OrgChart, node: HierarchyNode<NodeData>, event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.stopPropagation();
  chart.fit({nodes: [node.parent], scale: false});
}

function hasOneHighlightedChild(node: HierarchyNode<NodeData>): boolean {
  return node.children?.filter( n => n.data._upToTheRootHighlighted || n.data._highlighted || n.data.toggled)?.length === 1;
}

function goToHighlightedChild(chart: OrgChart, node: HierarchyNode<NodeData>, event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.stopPropagation();
  const child = node.children?.filter( n => n.data._upToTheRootHighlighted || n.data._highlighted || n.data.toggled)[0];
  chart.fit({nodes: [child], scale: false});
}

export function getNodeComponentRender(chart: OrgChart) {
    function nodeComponent(d: HierarchyNode<NodeData>): JSX.Element {
        return (
        <div onClick={(_) => toggle(chart, d.data)} className={d.data.toggled ? 'node toggled' : (d.data._highlighted || d.data._upToTheRootHighlighted ? 'node highlighted' : 'node')}>
            <div className='node-header'>
              <div className='node-rank'>{d.data.rank}</div>
              <a className='node-wiki' href={`https://en.wikipedia.org/wiki/${d.data.scientific_name}`} target='_blank' onClick={e => e.stopPropagation()}>W</a>
            </div>
            <div className='node-names'>
              {d.data.name ? <div className='node-name'>{d.data.name}</div> : <></>}
              <div className='node-sci-name'>{d.data.scientific_name}</div>
            </div>
            {d.parent ? <div className='node-arrow up' onClick={e => goToParent(chart, d, e)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.457 8.07005L3.49199 16.4296C3.35903 16.569 3.28485 16.7543 3.28485 16.9471C3.28485 17.1398 3.35903 17.3251 3.49199 17.4646L3.50099 17.4736C3.56545 17.5414 3.64304 17.5954 3.72904 17.6324C3.81504 17.6693 3.90765 17.6883 4.00124 17.6883C4.09483 17.6883 4.18745 17.6693 4.27344 17.6324C4.35944 17.5954 4.43703 17.5414 4.50149 17.4736L12.0015 9.60155L19.4985 17.4736C19.563 17.5414 19.6405 17.5954 19.7265 17.6324C19.8125 17.6693 19.9052 17.6883 19.9987 17.6883C20.0923 17.6883 20.1849 17.6693 20.2709 17.6324C20.3569 17.5954 20.4345 17.5414 20.499 17.4736L20.508 17.4646C20.641 17.3251 20.7151 17.1398 20.7151 16.9471C20.7151 16.7543 20.641 16.569 20.508 16.4296L12.543 8.07005C12.4729 7.99653 12.3887 7.93801 12.2954 7.89801C12.202 7.85802 12.1015 7.8374 12 7.8374C11.8984 7.8374 11.798 7.85802 11.7046 7.89801C11.6113 7.93801 11.527 7.99653 11.457 8.07005Z" fill="#000" stroke="#000"></path>
                </svg>
              </div> : <></>}

            {hasOneHighlightedChild(d) ? <div className='node-arrow down' onClick={e => goToHighlightedChild(chart, d, e)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.497 7.98903L12 15.297L4.503 7.98903C4.36905 7.85819 4.18924 7.78495 4.002 7.78495C3.81476 7.78495 3.63495 7.85819 3.501 7.98903C3.43614 8.05257 3.38462 8.12842 3.34944 8.21213C3.31427 8.29584 3.29615 8.38573 3.29615 8.47653C3.29615 8.56733 3.31427 8.65721 3.34944 8.74092C3.38462 8.82463 3.43614 8.90048 3.501 8.96403L11.4765 16.74C11.6166 16.8765 11.8044 16.953 12 16.953C12.1956 16.953 12.3834 16.8765 12.5235 16.74L20.499 8.96553C20.5643 8.90193 20.6162 8.8259 20.6517 8.74191C20.6871 8.65792 20.7054 8.56769 20.7054 8.47653C20.7054 8.38537 20.6871 8.29513 20.6517 8.21114C20.6162 8.12715 20.5643 8.05112 20.499 7.98753C20.3651 7.85669 20.1852 7.78345 19.998 7.78345C19.8108 7.78345 19.6309 7.85669 19.497 7.98753V7.98903Z" fill="#000" stroke="#000"></path>
              </svg>
            </div> : <></>}
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
