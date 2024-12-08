import { LineChart } from '@mui/x-charts/LineChart';
import { DataModel } from '../models/data.model'; 

interface ChartsProps {
    data: DataModel[];
}

function Charts({ data }: ChartsProps) {
    const isDifferenceGreaterThan20Percent = (prevValue: number, currentValue: number) => {
        if (prevValue === 0) return false;
        const difference = Math.abs((currentValue - prevValue) / prevValue) * 100;
        return difference >= 20;
    };

    const chartData = data.map((item: DataModel) => ({
        deviceId: item.deviceId,
        temperature: item.temperature,
        pressure: item.pressure,
        humidity: item.humidity,
        readingDate: new Date(item.readingDate).toISOString(),
        id: item.deviceId
    }));

    const xLabels = chartData.map(item => new Date(item.readingDate).toLocaleString());

    const createSeriesData = (data: (number | undefined)[]) => {
        const normalData: (number | null)[] = [];
        const highlightedData: (number | null)[] = [];
        const deviceIds: number[] = [];

        data.forEach((value, index, array) => {
            if (value === undefined) {
                normalData.push(null);
                highlightedData.push(null);
            } else if (index > 0 && array[index - 1] !== undefined && isDifferenceGreaterThan20Percent(array[index - 1] as number, value)) {
                normalData.push(null);
                highlightedData.push(value);
                deviceIds.push(index);
            } else {
                normalData.push(value);
                highlightedData.push(null);
            }
        });

        localStorage.setItem('highlightedDeviceIds', JSON.stringify(deviceIds));
        console.log(deviceIds);

        return { normalData, highlightedData };
    };

    const pressureData = createSeriesData(chartData.map(item => item.pressure !== undefined ? item.pressure / 10 : undefined));
    const humidityData = createSeriesData(chartData.map(item => item.humidity));
    const temperatureData = createSeriesData(chartData.map(item => item.temperature));

    if (!data.length) {
        return (
            <>
                <h2>No data</h2>
            </>
        );
    }

    return (
        <>
            {data && <LineChart
                width={1000}
                height={300}
                series={[
                    {
                        data: pressureData.normalData,
                        label: 'Pressure x10 [hPa]',
                        color: '#26b4b5',
                    },
                    {
                        data: pressureData.highlightedData,
                        label: 'Pressure x10 [hPa] - significant difference',
                        color: 'red'
                    },
                    {
                        data: humidityData.normalData,
                        label: 'Humidity [%]',
                        color: '#72cbfe'
                    },
                    {
                        data: humidityData.highlightedData,
                        label: 'Humidity [%] - significant difference',
                        color: 'red'
                    },
                    {
                        data: temperatureData.normalData,
                        label: 'Temperature [°C]',
                        color: '#d119db'
                    },
                    {
                        data: temperatureData.highlightedData,
                        color: 'red',
                        label: 'Temperature [°C] - significant difference',
                    }
                ]}
                xAxis={[{ scaleType: 'point', data: xLabels }]}
                legend={{ hidden: true }}
            />}
        </>
    );
}

export default Charts;




