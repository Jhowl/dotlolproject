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
  const labels = data?.map((item) => item.interval_start?.split('T')[0] + `(${item.total_matches})`);
  const data1 = {
    labels: labels,
    datasets: [
      {
        label: 'Duration',
        data: data?.map((item) => item.average_duration / 60),
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
