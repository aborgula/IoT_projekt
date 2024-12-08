import { useEffect, useState } from 'react';
import DevicesState from "./DevicesState";
import CurrentState from "./CurrentState";
import Charts from "./Charts";
import serverConfig from "../server-config";
import { sortElemsByDeviceId } from "../utils/helper";
import { useParams } from "react-router-dom";
import Loader from "./shared/Loader";
import { DataModel } from "../models/data.model";
import { TextField, Container, Box, Button } from '@mui/material';



function Dashboard() {
    let { id } = useParams();
    const [data, setData] = useState<DataModel[] | null>(null);
    const [lastItem, setLastItem] = useState<DataModel | null>(null);
    const [additionalData, setAdditionalData] = useState<DataModel[] | null>(null);
    const [loaderState, setLoaderState] = useState(true);
    const [loaderChart, setLoaderChart] = useState(true);
    const [numberInput, setNumberInput] = useState<number>(1); 
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [highlightedDeviceIds, setHighlightedDeviceIds] = useState<number[]>([]); 

    

    useEffect(() => {
        fetchData();
        fetchAdditionalData();
        fetchPosts(); 
        fetchsignificant();

    }, [id, numberInput]); 

    const fetchAllDevicesData = () => {
        for (let deviceId = 0; deviceId <= 16; deviceId++) {
            fetch(`${serverConfig.serverUrl}data/${deviceId}`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token') || ''
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Data for device ID ${deviceId}:`, data);
            })
            .catch(error => {
                console.error(`Error fetching data for device ID ${deviceId}:`, error);
            });
        }
    };

    const isDifferenceGreaterThan20Percent = (prevValue: number | undefined, currentValue: number) => {
        if (prevValue === undefined) return false;
        const difference = Math.abs((currentValue - prevValue) / prevValue) * 100;
        return difference >= 20;
    };
    

    const processDataForSignificantDifferences = (data: DataModel[]) => {
        const highlightedIds = new Set<number>();
    
        data.forEach((item, index, array) => {
            if (index === 0) return;
            const prevItem = array[index - 1];
    
            if (prevItem && item && typeof item.temperature === 'number' && typeof item.pressure === 'number' && typeof item.humidity === 'number') {
                if (isDifferenceGreaterThan20Percent(prevItem.temperature, item.temperature) ||
                    isDifferenceGreaterThan20Percent(prevItem.pressure, item.pressure) ||
                    isDifferenceGreaterThan20Percent(prevItem.humidity, item.humidity)) {
                    highlightedIds.add(item.deviceId);
                }
            }
        });
    
        setHighlightedDeviceIds(Array.from(highlightedIds));
    };

    const fetchData = () => {
        setLoaderState(true);
        fetch(`${serverConfig.serverUrl}data/latest`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            }
        })
            .then(response => response.json())
            .then((data: DataModel[]) => {
                const sortedData = sortElemsByDeviceId([...data]);
                setData(sortedData);
                setLoaderState(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const fetchAdditionalData = () => {
        setLoaderChart(true);

        fetch(`${serverConfig.serverUrl}data/${id}`, { 
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setLastItem(data[data.length - 1]);
                setAdditionalData(data);
                processDataForSignificantDifferences(data); 
                setLoaderChart(false);
            })
            .catch(error => {
                console.error('Error fetching additional data:', error);
            });
    };

    const fetchPosts = () => {

        fetch("http://localhost:3100/api/data/latest", {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token') || ''
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log('Fetched posts:', data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    };


    const handleDeleteDevices = () => {
        
        if (startDate && endDate) {
            fetch(`${serverConfig.serverUrl}data/${id}/delete`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ startDate, endDate })
            })
            .then(response => {
                if (response.ok) {
                    console.log('Devices deleted successfully');
                    fetchData(); 
                    window.location.reload(); 
                } else {
                    console.error('Failed to delete devices');
                }
            })
            .catch(error => {
                console.error('Error deleting devices:', error);
            });
        } else {
            alert("Please select both start and end date");
        }
    };


    const fetchsignificant = async () => {
        const allData = [];
        const significantId = [];

        try {
            for (let i = 0; i <= 16; i++) {
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

                for(let j = 0; j < data.length; j++){
                    if( j >= 1){
                        if((Math.abs((data[j].pressure - data[j-1].pressure) / data[j-1].pressure) * 100) >= 20){
                            significantId.push(data[j].deviceId);
                        }
                        if((Math.abs((data[j].humidity - data[j-1].humidity) / data[j-1].humidity) * 100) >= 20){
                            significantId.push(data[j].deviceId);
                        }
                        if((Math.abs((data[j].temperature - data[j-1].temperature) / data[j-1].temperature) * 100) >= 20){
                            significantId.push(data[j].deviceId);
                        }

                    }
                }

            }

        localStorage.setItem('signId', JSON.stringify(significantId));          

        } catch (error) {
            console.error('Error fetching additional data:', error);
        }
    };

    return <div style={{ overflowY: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
    <div style={{
        display: 'flex',
        flex: '1',
        alignItems: 'center',
        justifyContent: "space-evenly",
        borderBottom: '10px solid #fff',
        padding: '50px'
    }}>
        <div>
            {loaderChart && <Loader />}
            {!loaderChart && <CurrentState data={lastItem} />}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Container style={{ flex: '1', marginTop: '20px', textAlign: 'center' }}>
                {loaderChart && <Loader />}
                {!loaderChart && additionalData && <Charts data={additionalData} />}
               
            </Container>
            <Container style={{ flex: '1', marginTop: '20px' }}>
                <Box mt={2}>
                    <TextField
                        type="date"
                        label="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Box>
                <Box mt={2}>
                    <TextField
                        type="date"
                        label="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Box>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDeleteDevices}
                        fullWidth
                    >
                        Delete Devices
                    </Button>
                </Box>
            </Container>
        </div>
    </div>
    <div style={{ backgroundColor: '#000', display: 'flex', justifyContent: 'center' }}>
        {loaderState && <Loader />}
        {!loaderState && data && <DevicesState data={data} />}
    </div>
</div>

}

export default Dashboard;

