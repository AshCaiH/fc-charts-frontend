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
        borderColor: ["#003f5c","#1c4771","#3d4d83","#615190","#865196","#ab5094","#cc508b","#e7537b","#fb5f67","#ff724e","#ff8b32","#ffa600"],
        pointBackgroundColor: "#ff6384)",
        pointRadius: 0,
        stepped: "before",
    })
});

console.log(parsedData);

parsedData.map(item => {
    item.data[0].x = new Date(2024, 0, 1);
    item.data[0].y = 0;
    // item.data.push({x: new Date(Date.now()), y: item.data[item.data.length-1]})
})

parsedData.sort((a, b) => 
    a.data[a.data.length-1].y -
    b.data[b.data.length-1].y
)

console.log(parsedData);

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
    datasets: parsedData,    
    tension: 0.1,
};

// borderColor: ["#003f5c","#2f4b7c","#665191","#a05195","#d45087","#f95d6a","#ff7c43","#ffa600", "#ffc800", "#ffe900"],

export const MyChart = () => {
    return <Line options={options} data={data} />;
};

export default MyChart;