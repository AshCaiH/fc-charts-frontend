import chartData from "../testdata/chartdata.json"
import { Line } from "react-chartjs-2";
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

const dates = chartData[0].data.map(item => new Date(item.date));
const scores = chartData[0].data.map(item => item.fcAverage);

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
    scales: {
        x: {
        type: 'linear',
        position: 'bottom'
        }
    }
};

export const myData = chartData[1].data.map(item => {return {x: new Date(item.date), y: item.fcAverage}});

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    // labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: myData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

export const MyChart = () => {
    return <Line options={options} data={data} />;
};

export default MyChart;