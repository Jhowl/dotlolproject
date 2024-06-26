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

export default function Chart({ data }) {
  const data1 = {
    labels: data.labels,
    datasets: [
      {
        label: 'Duration',
        data: data.chart?.map((item) => item.average_duration / 60),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h1>Matches Duration</h1>
      <div style={{ width: '100%', flexGrow: 1 }}>
      <Line
        data={data1}
        options={options}
      />
      </div>
    </div>
  );
}
