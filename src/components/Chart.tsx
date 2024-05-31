// import chartData from "../testdata/chartdata.json"
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,
    Title,Tooltip,Legend,TimeScale} from 'chart.js';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,
    Tooltip,Legend,TimeScale);

const chartData = await fetch(`${import.meta.env.VITE_SERVER_URL}/makeCharts`, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
}).then(response => response.json());

const rawData = chartData.extra.result.filter(data => data.user != "<Deleted>");
const parsedData : any[] = [];

const borderColours = ["#04B0EA","#0389B6","#3d4d83","#615190","#865196","#ab5094","#cc508b","#e7537b","#fb5f67","#ff724e","#ff8b32","#ffa600"]

rawData.map(user => {
    const currentGameScores: { [key: string]: number } = {};

    user.games.map(game => currentGameScores[game.title] = 0);

    user.games = user.games.filter(game => game.isReleased);

    const flatReviews = user.games.map(game => game.data.map(review => {
        const modifier: 1 | -1 = (game.counterpicked ? -1 : 1)

        return {
            date: Date.parse(review.date),
            game: game.title,
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

    const finalScore = flatReviews[flatReviews.length-1].currentUserScore

    parsedData.push({
        data: flatReviews.map(item => {return {x: new Date(item.date), y: item.currentUserScore}}),
        label: `${finalScore.toFixed(2)} - ${user.user}`,
        borderColor: (ctx) => borderColours[ctx.index],
        backgroundColor: (ctx) => borderColours[ctx.index],
        pointBackgroundColor: "#ff6384",
        borderWidth: 2,
        pointRadius: 0,
        stepped: "before",
    })
});

parsedData.sort((a, b) => 
    a.data[a.data.length-1].y -
    b.data[b.data.length-1].y
)

parsedData.map((item, index) => {
    item.data[0].x = new Date(2024, 0, 1);
    item.data[0].y = 0;
    item.data.push({
        x: new Date(2024, 11, 31), 
        y: item.data[item.data.length-1].y, 
        lineColour: borderColours[index],
        position: index,
    })
})

ChartJS.defaults.borderColor = '#00000015';
ChartJS.defaults.color = '#796262';

const datapoints: any[] = [];

export const options:any = {
    responsive: true,
    maintainAspectRatio: false,
    animations: false,
    layout: {
        padding: {
            right: 225,
            left: 20,
            top: 10
        },
    },
    plugins: {        
        datalabels: {
            align: 'right',
            // display: 'auto',
            color: (ctx) => {
                return ctx.dataset.data[ctx.dataset.data.length-1].lineColour},
            display: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1,
            formatter: (v, ctx) => ctx.dataset.label,
            offset: (ctx) => {
                const chart = ctx.chart;
                const meta = chart.getDatasetMeta(ctx.datasetIndex);
                const model = meta.data[ctx.dataIndex];
                datapoints.push(model);
                const position = ctx.dataset.data[ctx.dataset.data.length-1].position;
                if (position == parsedData.length-1) resolveOverlaps();
                return 2;
            },
            font: {
                weight: 300,
                size: 16
            },
        },
        legend: {
            display: false,
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

const resolveOverlaps = () => {
// Resolve overlapping labels
    let overlaps = false;

    do {
        overlaps = false;

        datapoints.map((dp1, index) => {
            if (dp1 === datapoints[datapoints.length-1]) {
                return;
            }
            const dp2 = datapoints[index+1];

            while (dp1.y - dp2.y < 20) {
                overlaps = true;
                dp1.y += 1;
                dp2.y -= 1;
            }
        })

    } while (overlaps)
}


export const data = {
    datasets: parsedData,    
    tension: 0.1,
};

export const MyChart = () => {
    return <Line options={options} plugins={[ChartDataLabels]} data={data} />;
};

export default MyChart;