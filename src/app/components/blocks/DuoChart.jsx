import * as React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

export default function Chart({ data1, data2 }) {

  // const labels = [
  //   ...(data1?.labels ?? [])
  // ].sort((a, b) => a - b)

  //merge labels from both data sets and remove duplicates
  const labels = [
    ...(data1?.labels ?? []),
    ...(data2?.labels ?? [])
  ].filter((value, index, self) => self.indexOf(value) === index)

  const data = {
    labels: labels,
    datasets: [
      {
        label: data1?.name,
        data: data1?.chart?.map((item) => item.average_duration / 60),
        fill: false,
        backgroundColor: 'rgb(255, 0, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: data2?.name,
        data: data2?.chart?.map((item) => item.average_duration / 60),
        fill: false,
        backgroundColor: 'rgb(54, 0, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h1>Matches Duration</h1>
      <div style={{ width: '100%', flexGrow: 1 }}>
      <Line
        data={data}
        options={options}
      />
      </div>
    </div>
  );
}
