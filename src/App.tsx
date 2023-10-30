import { useCallback, useEffect } from 'react';
import './App.css';
import { configureChart, getNodeComponentRender } from './chart/Chart';
import { OrgChart } from 'd3-org-chart';
import './chart/Chart.css';
import { ButtonsComponent } from './buttons/Buttons';
import { NodeData } from './NodeData';

function App() {
  const sampleData = [
    {id: 1, parentId: null, name: "Root", "description": "The root of all evil."},
    {id: 2, parentId: 1, name: "Left", "description": "Will I go left?"},
    {id: 3, parentId: 1, name: "Right", "description": "Or the other way?"},
    {id: 4, parentId: 2, name: "Left 1", "description": "There are more children."},
    {id: 5, parentId: 2, name: "Left 2", "description": "To be determined."},
  ]

  let chart: OrgChart<NodeData> = new OrgChart();

  const renderNode = useCallback(getNodeComponentRender(chart), []);

  useEffect(() => {
    configureChart(chart, (_) => null, renderNode)
      .container("#chart")
      .data(sampleData)
      .render()
  });

  return (
    <div>
      <div id="chart" />
      <div id="buttons">
        <ButtonsComponent chart={chart} data={sampleData}></ButtonsComponent>
      </div>

    </div>
  );
}

export default App;
