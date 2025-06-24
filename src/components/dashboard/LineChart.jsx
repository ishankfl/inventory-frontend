// import { Line } from 'recharts'; // Or the correct library name 
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; import { Line } from 'react-chartjs-2';
// Register chart.js components 
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const LineChart = () => {
    const options =
    {
        responsive: true, plugins:
        {
            legend: { position: "top", }, 
            title:
                { 
                display: true, 
                text: "Line Chart: Monthly Sales Trend for Products A & B", },
        },
    }

    const labels = ["January", "February", "March", "April", "May", "June", "July"]

    const productASales = [100, 120, 110, 130, 120, 140, 150]
    const productBSales = [120, 150, 170, 140, 190, 50, 200]

    // const productBSales = [80, 75, 95, 100, 110, 105, 120, 115]

    const data = { labels, datasets:
         [{ label: "Product A Sales", data: productASales, borderColor: "rgb(255, 99, 132)", backgroundColor: "rgba(255, 99, 132)", }, 
            { label: "Product B Sales", data: productBSales, borderColor: "rgb(53, 162, 235)", backgroundColor: "rgba(53, 162, 235)", },], }

    return <Line options={options} data={data} aria-label='hi' />
}
export default LineChart