import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { configureChart, getNodeComponentRender } from './chart/Chart';
import { OrgChart } from './d3-org-chart';
import './chart/Chart.css';
import { ButtonsComponent } from './buttons/Buttons';
import { NodeData } from './NodeData';

function App() {
  const [data, setData] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chart] = useState<OrgChart>(new OrgChart);

  const renderNode = useCallback(getNodeComponentRender(chart), []);

  useEffect(() => {
    fetch('data.json').then((res) => res.json()).then((dat) => {
      console.log(dat.length);
      setData(dat as NodeData[]);
      (configureChart(chart, (_) => null, renderNode) as any)
        .container("#chart")
        .data(dat)
        .render()
      setLoading(false);
    });
  }, [chart]);

  return (
    <div>
      {loading ? <div id="loading">Loading...</div> : <></>}
      <div id="chart" />
      <div id="buttons">
        <ButtonsComponent chart={chart} data={data}></ButtonsComponent>
      </div>

    </div>
  );
}

export default App;
