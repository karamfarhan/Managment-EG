import { VictoryChart, VictoryLine, VictoryTheme, VictoryBar } from "victory";

const data = [
  { x: "january", y: 30 },
  { x: "february", y: 4 },
  { x: "march", y: 7 },
  { x: "april", y: 10 },
  { x: "may", y: 12 },
];

const data2 = [
  { x: "A", y: 2 },
  { x: "B", y: 3 },
  { x: "C", y: 5 },
  { x: "D", y: 4 },
  { x: "E", y: 7 },
];
export const MyChartOne = () => (
  <div style={{ height: "500px", background: "#fff" }}>
    <VictoryChart
      theme={VictoryTheme.material}
      animate={{
        duration: 2000,
        onLoad: { duration: 300 },
      }}
    >
      <VictoryLine data={data} x="x" y="y" />
    </VictoryChart>
  </div>
);

const chartTheme = {
  axis: {
    style: {
      tickLabels: {
        fill: "orange",
      },
    },
  },
};

export const MyChartTwo = () => (
  <div style={{ height: "500px", background: "#fff" }}>
    <VictoryChart

      theme={chartTheme}
      width={300}
      style={{
        grid: { stroke: "#000", strokeWidth: 1 },
      }}


      domain={{ x: [0, 8] }}
      animate={{
        duration: 2000,
        onLoad: { duration: 300 },
      }}
    >
      <VictoryBar
        data={data2}

        style={{ data: { fill: "#c43a31", stroke: "white", strokeWidth: 1 } }}


      />
    </VictoryChart>
  </div>
);
