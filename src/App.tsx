import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { configureChart, getNodeComponentRender } from './chart/Chart';
import { OrgChart } from 'd3-org-chart';
import './chart/Chart.css';
import { ButtonsComponent } from './buttons/Buttons';
import { NodeData } from './NodeData';

function App() {
  const [data, setData] = useState<{data: NodeData[]}>({data: []})
  const sampleData = [
    {id: 1, parentId: null, scientific_name: "Root", name: "The root of all evil.", rank: "test"},
    {id: 2, parentId: 1, scientific_name: "Left", name: "Will I go left?", rank: "test"},
    {id: 3, parentId: 1, scientific_name: "Right", name: "Or the other way?", rank: "test"},
    {id: 4, parentId: 2, scientific_name: "Left 1", name: "There are more children.", rank: "test"},
    {id: 5, parentId: 2, scientific_name: "Left 2", name: "To be determined.", rank: "test"},
  ]

  let chart: OrgChart<NodeData> = new OrgChart();

  const renderNode = useCallback(getNodeComponentRender(chart), []);

  const effectRan = useRef(false)

  useEffect(() => {
    if (!effectRan.current) {
      fetch('reduceddata.json').then((res) => res.json()).then((dat) => {
        setData((curr) => {
          curr.data = dat as NodeData[];
          return curr;
        });
        console.log(dat.length);
        configureChart(chart, (_) => null, renderNode)
          .container("#chart")
          .data(dat)
          .render()
      });
    }

    return () => {
      effectRan.current = true;
    }
    
  }, []);

  return (
    <div>
      <div id="chart" />
      <div id="buttons">
        <ButtonsComponent chart={chart} data={data.data}></ButtonsComponent>
      </div>

    </div>
  );
}

export default App;
