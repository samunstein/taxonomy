import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { configureChart, getNodeComponentRender } from './chart/Chart';
import { OrgChart } from './d3-org-chart';
import './chart/Chart.css';
import { ButtonsComponent } from './buttons/Buttons';
import { NodeData } from './NodeData';

function App() {
  const [data, setData] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState({loading: true, text: "Loading"});
  const [chart] = useState<OrgChart>(new OrgChart());

  const renderNode = useCallback(getNodeComponentRender(chart), []);

  useEffect(() => {
    fetch('data.json')
      .then(async (res) => {
        return res.json();
      })
      .then(async (dat) => {
        console.log(dat.length);
        setData(dat as NodeData[]);
        (configureChart(chart, renderNode) as any)
          .container("#chart")
          .data(dat)
          .render()
        setLoading((curr) => {
          return {...curr, loading: false};
        });
    });
  }, [chart]);

  return (
    <div>
      {loading.loading ? <div id="loading">{loading.text}</div> : <></>}
      <div id="chart" />
      <div id="buttons">
        <ButtonsComponent chart={chart} data={data}></ButtonsComponent>
      </div>

    </div>
  );
}

export default App;
