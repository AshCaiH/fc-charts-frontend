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


const allReviews : {date: number, game: string, score: number, runningScore: number }[] = chartData.map(game => game.data.map(review => {
    return {
        date: Date.parse(review.date),
        game: game.game,
        score: review.fcAverage,
        runningScore: 0,
    }
})).flat();

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const myData = chartData[1].data.map(item => {return {x: new Date(item.date), y: item.fcAverage}});

const runningGameScore = {}
chartData.map(item => runningGameScore[item.game] = 0);
console.log(runningGameScore);

allReviews.sort((a, b) => a.date - b.date);

allReviews.forEach((item, index) => {
    runningGameScore[item.game] = item.score;
    allReviews[index]["runningScore"] = Object.values(runningGameScore).reduce((prev:number, now:number) => {return prev + now}, 0) 
});

console.log(allReviews);

export const options:any = {
    responsive: true,
    maintainAspectRatio: false,
    animations: false,
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


// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    // labels,
    datasets: [
        {
            label: 'Username',
            data: allReviews.map(item => {return {y: item.runningScore, x: new Date(item.date)}}),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

export const MyChart = () => {
    return <Line options={options} data={data} />;
};

export default MyChart;