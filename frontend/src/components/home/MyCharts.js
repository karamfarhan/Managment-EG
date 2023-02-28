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
<<<<<<< HEAD
const chartTheme = {
  axis: {
    style: {
      tickLabels: {
        fill: "orange",
      },
    },
  },
};
=======
>>>>>>> c9f6c2a (charts_part_one)

export const MyChartTwo = () => (
  <div style={{ height: "500px", background: "#fff" }}>
    <VictoryChart
<<<<<<< HEAD
      theme={chartTheme}
      width={300}
      style={{
        grid: { stroke: "#000", strokeWidth: 1 },
      }}
=======
      width={300}
>>>>>>> c9f6c2a (charts_part_one)
      domain={{ x: [0, 8] }}
      animate={{
        duration: 2000,
        onLoad: { duration: 300 },
      }}
    >
      <VictoryBar
        data={data2}
<<<<<<< HEAD
        style={{ data: { fill: "#c43a31", stroke: "white", strokeWidth: 1 } }}
=======
        style={{ data: { fill: "#c43a31", stroke: "black", strokeWidth: 1 } }}
>>>>>>> c9f6c2a (charts_part_one)
      />
    </VictoryChart>
  </div>
);
