import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link } from 'react-router-dom';
import { DataModel } from "../../models/data.model";
import { useEffect } from 'react';

interface TileProps {
    data: DataModel | null;
    id?: string | number;
    hasData?: boolean;
    details?: boolean;
    active?: boolean;
    highlight?: boolean;  
    isSignificantChange?: boolean; 
}

function Tile({ id, hasData, data, active = false, details = true, highlight = false }: TileProps) {
    useEffect(() => {
        const highlightedDeviceIdsStr = localStorage.getItem('highlightedDeviceIds');
        if (highlightedDeviceIdsStr) {
            const highlightedDeviceIds = JSON.parse(highlightedDeviceIdsStr) as number[];

            const isHighlighted = highlightedDeviceIds.includes(id as number);

            const tileElement = document.getElementById(`tile-${id}`);
            if (tileElement) {
                if (isHighlighted) {
                    tileElement.classList.add('highlight');
                } else {
                    tileElement.classList.remove('highlight');
                }
            }
        }
    }, [id, data]);
    
    return (
        <Card className={`tile-device-inside ${active ? 'active' : ''} ${highlight ? 'highlight' : ''}`} sx={{ minWidth: 275 }}>
            <CardContent style={{ minHeight: '200px' }}>
                <Typography style={{ borderBottom: '5px solid #fff', paddingBottom: '10px' }} variant="h5" component="div">
                    Device No. {id}
                </Typography>
                {!hasData && (
                    <Typography variant="h6" component="div">
                        No data
                    </Typography>
                )}
                {hasData && (
                    <Typography style={{ paddingTop: '10px' }} component="div">
                        <Typography variant="h6" component="div">
                            <DeviceThermostatIcon />
                            <span className="value">{data?.temperature}</span> <span>&deg;C</span>
                        </Typography>
                        <Typography variant="h6" component="div">
                            <CloudUploadIcon />
                            <span className="value">{data?.pressure}</span> hPa
                        </Typography>
                        <Typography variant="h6" component="div">
                            <OpacityIcon />
                            <span className="value">{data?.humidity}</span>%
                        </Typography>
                    </Typography>
                )}
            </CardContent>
            {details && (
                <CardActions>
                   <Button size="small" component={Link} to={`/device/${id}`}>Details</Button>
                </CardActions>
            )}
        </Card>
    );
}

export default Tile;


