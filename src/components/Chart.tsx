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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const rawData = chartData.extra.result;
const parsedData : any[] = [];

rawData.map(user => {

    const currentGameScores: { [key: string]: number } = {};

    user.games.map(game => currentGameScores[game.game] = 0);

    const flatReviews = user.games.map(game => game.data.map(review => {
        return {
            date: Date.parse(review.date),
            game: game.game,
            score: review.fcAverage,
            currentUserScore: 0,
        }
    })).flat();

    flatReviews.sort((a, b) => a.date - b.date);

    // Each review tracks the user's total score at the given point in time.
    flatReviews.forEach((review, index) => {
        currentGameScores[review.game] = review.score;
        flatReviews[index].currentUserScore = Object.values(currentGameScores).reduce(
            (prev: number, now: number) => prev + now, 0
        )
    });



    parsedData.push({
        label: user.user,
        data: flatReviews.map(item => {return {x: new Date(item.date), y: item.currentUserScore}}),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
    })
});


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


export const data = {
    // labels,
    datasets: parsedData
};

export const MyChart = () => {
    return <Line options={options} data={data} />;
};

export default MyChart;