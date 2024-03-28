import chartData from "../testdata/chartdata.json"
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,
    Title,Tooltip,Legend,TimeScale} from 'chart.js';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,
    Tooltip,Legend,TimeScale);

const rawData = chartData.extra.result;
const parsedData : any[] = [];

const borderColours = ["#04B0EA","#0389B6","#3d4d83","#615190","#865196","#ab5094","#cc508b","#e7537b","#fb5f67","#ff724e","#ff8b32","#ffa600"]

rawData.map(user => {

    const currentGameScores: { [key: string]: number } = {};

    user.games.map(game => currentGameScores[game.game] = 0);

    const flatReviews = user.games.map(game => game.data.map(review => {
        const modifier: 1 | -1 = (game.counterpicked ? -1 : 1)

        return {
            date: Date.parse(review.date),
            game: game.game,
            score: review.fcAverage * modifier,
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
        borderColor: (ctx) => borderColours[ctx.index],
        backgroundColor: (ctx) => borderColours[ctx.index],
        pointBackgroundColor: "#ff6384",
        borderWidth: 2,
        pointRadius: 0,
        stepped: "before",
    })
});

console.log(parsedData);


parsedData.sort((a, b) => 
    a.data[a.data.length-1].y -
    b.data[b.data.length-1].y
)

parsedData.map((item, index) => {
    item.data[0].x = new Date(2024, 0, 1);
    item.data[0].y = 0;
    item.data.push({x: new Date(2024, 11, 31), y: item.data[item.data.length-1].y, lineColour: borderColours[index]})
})

let index = 0;

ChartJS.defaults.borderColor = '#FFF2';
ChartJS.defaults.color = '#FFFC';

export const options:any = {
    responsive: true,
    maintainAspectRatio: false,
    animations: false,
    layout: {
        padding: {
            right: 256,
            top: 1
        },
    },
    plugins: {        
        datalabels: {
            align: 'right',
            // display: 'auto',
            color: (ctx) => {
                console.log(ctx);
                return ctx.dataset.data[ctx.dataset.data.length-1].lineColour},
            display: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1,
            formatter: (v, ctx) => ctx.dataset.label,
            offset: 8,
            font: {
                weight: 300,
                size: 16
            },
        },
        title: {
            display: true,
            text: 'Fantasy Critic Chart',
        },
    },
    scales: {
        x: {
            type: "time",
            time: {
                displayFormats: {
                    month: 'MMM'
                }
            },
            position: "bottom",
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
    return <Line options={options} plugins={[ChartDataLabels]} data={data} />;
};

export default MyChart;