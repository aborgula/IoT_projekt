import { useState, useEffect } from "react";
import serverConfig from "../server-config";
import DevicesState from "./DevicesState";
import { sortElemsByDeviceId } from "../utils/helper";
import Loader from "./shared/Loader";
import { DataModel } from "../models/data.model";
import ChartHome from "./ChartHome";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

function Home() {
    const [additionalData, setAdditionalData] = useState<DataModel[] | null>(null);
    const [loaderChart, setLoaderChart] = useState(true);
    const [lastItem, setLastItem] = useState<DataModel | null>(null);
    const [data, setData] = useState<DataModel[] | null>(null);
    const [loaderState, setLoaderState] = useState(true);

    const [deviceId, setDeviceId] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [pressure, setPressure] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchData();
        fetchAdditionalData();
    }, []);

    const fetchAdditionalData = async () => {
        setLoaderChart(true);
        const allData = [];

        try {
            for (let i = 1; i <= 16; i++) {
                const response = await fetch(`${serverConfig.serverUrl}data/${i}`, {

                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'x-auth-token': localStorage.getItem('token') || ''
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                allData.push(data);
            }


            if (allData.length > 0) {
                setLastItem(allData[allData.length - 1][allData[allData.length - 1].length - 1]);
                setAdditionalData(allData.flat());
            }

            setLoaderChart(false);
        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    const fetchData = () => {
        setLoaderState(true);
        fetch(`${serverConfig.serverUrl}data/latest`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setData(sortElemsByDeviceId(data));
                setLoaderState(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError('');

        if (!deviceId || !temperature || !humidity || !pressure) {
            setFormError('Please fill out all fields.');
            return;
        }

        const deviceIdNum = parseInt(deviceId, 10);
        const temperatureNum = parseFloat(temperature);
        const humidityNum = parseFloat(humidity);
        const pressureNum = parseFloat(pressure);

        if (isNaN(deviceIdNum) || isNaN(temperatureNum) || isNaN(humidityNum) || isNaN(pressureNum)) {
            setFormError('Please enter valid numbers.');
            return;
        }

        const payload = {
            air: [
                { id: 1, value: temperatureNum },
                { id: 2, value: pressureNum },
                { id: 3, value: humidityNum }
            ]
        };

        try {
            console.log('Submitting data:', payload);
            const response = await fetch(`${serverConfig.serverUrl}data/${deviceIdNum}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(payload)
            });
            window.location.reload(); 

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }

            setDeviceId('');
            setTemperature('');
            setHumidity('');
            setPressure('');

            fetchData();
            fetchAdditionalData();
            window.location.reload(); 

        } catch (error) {
            console.error('Error submitting data:', error);
            setFormError(`Error submitting data: ${error}`);
        }
    };

    return (
        <div style={{ overflowY: 'auto', height: '100vh' }}>
            <div style={{
                display: 'flex',
                height: '50vh',
                alignItems: 'center',
                justifyContent: "space-evenly",
                borderBottom: '10px solid #fff',
                padding: '50px'
            }}>
                <div>
                    {loaderChart && <Loader />}
                    {!loaderChart && additionalData && <ChartHome data={additionalData} />}
                </div>
                <div>
                    <Card className="tile-device-inside">
                        <CardContent style={{ minHeight: '200px' }}>
                            <Typography style={{ borderBottom: '5px solid #fff', paddingBottom: '10px' }} variant="h5" component="div">
                                Enter Data
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <TextField
                                        label="Device ID"
                                        variant="outlined"
                                        type="text"
                                        value={deviceId}
                                        onChange={(e) => setDeviceId(e.target.value)}
                                        fullWidth
                                        required
                                        margin="normal"
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Temperature (°C)"
                                        variant="outlined"
                                        type="float"
                                        value={temperature}
                                        onChange={(e) => setTemperature(e.target.value)}
                                        fullWidth
                                        required
                                        margin="normal"
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Humidity (%)"
                                        variant="outlined"
                                        type="number"
                                        value={humidity}
                                        onChange={(e) => setHumidity(e.target.value)}
                                        fullWidth
                                        required
                                        margin="normal"
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Pressure (hPa)"
                                        variant="outlined"
                                        type="number"
                                        value={pressure}
                                        onChange={(e) => setPressure(e.target.value)}
                                        fullWidth
                                        required
                                        margin="normal"
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </div>
                                {formError && <div style={{ color: 'red', marginTop: '10px' }}>{formError}</div>}
                                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                    Submit
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div style={{ backgroundColor: '#000', display: 'flex', justifyContent: 'center' }}>
                {loaderState && <Loader />}
                {!loaderState && data && <DevicesState data={data} />}
            </div>
        </div>
    );
}

export default Home;


