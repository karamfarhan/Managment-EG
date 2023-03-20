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
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 642d04b (dark theme)
=======
>>>>>>> 73569f1 (side bar modifying)
>>>>>>> 833ee3ff6f1ddbdce15c11278bfd16e0624378c0
const chartTheme = {
  axis: {
    style: {
      tickLabels: {
        fill: "orange",
      },
    },
  },
};
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c9f6c2a (charts_part_one)
=======
>>>>>>> 642d04b (dark theme)
=======
>>>>>>> 73569f1 (side bar modifying)
>>>>>>> 833ee3ff6f1ddbdce15c11278bfd16e0624378c0

export const MyChartTwo = () => (
  <div style={{ height: "500px", background: "#fff" }}>
    <VictoryChart
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 642d04b (dark theme)
=======
>>>>>>> 73569f1 (side bar modifying)
>>>>>>> 833ee3ff6f1ddbdce15c11278bfd16e0624378c0
      theme={chartTheme}
      width={300}
      style={{
        grid: { stroke: "#000", strokeWidth: 1 },
      }}
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
      width={300}
>>>>>>> c9f6c2a (charts_part_one)
=======
>>>>>>> 642d04b (dark theme)
=======
>>>>>>> 73569f1 (side bar modifying)
>>>>>>> 833ee3ff6f1ddbdce15c11278bfd16e0624378c0
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        style={{ data: { fill: "#c43a31", stroke: "white", strokeWidth: 1 } }}
=======
        style={{ data: { fill: "#c43a31", stroke: "black", strokeWidth: 1 } }}
>>>>>>> c9f6c2a (charts_part_one)
=======
        style={{ data: { fill: "#c43a31", stroke: "white", strokeWidth: 1 } }}
>>>>>>> 642d04b (dark theme)
=======
        style={{ data: { fill: "#c43a31", stroke: "white", strokeWidth: 1 } }}
>>>>>>> 73569f1 (side bar modifying)
>>>>>>> 833ee3ff6f1ddbdce15c11278bfd16e0624378c0
      />
    </VictoryChart>
  </div>
);
