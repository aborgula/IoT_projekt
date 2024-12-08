import './DeviceState.css';
import Tile from "./shared/Tile";
import {useParams} from 'react-router-dom';
import {DataModel} from "../models/data.model";
import { useEffect, useState } from 'react';

interface DeviceStateProps {
    data: DataModel[];
}

function DevicesState({data} : DeviceStateProps) {
    let {id} = useParams();


    const isHighlighteddeviceIdsStr = localStorage.getItem('signId');
    const isHighlighteddeviceIds: number[] = isHighlighteddeviceIdsStr ? JSON.parse(isHighlighteddeviceIdsStr) : [];

    
    return (
        <>
            {data && <div style={{display: "flex", flexWrap: "wrap", justifyContent: 'center'}}>
                {data.map(tile => {

                    const isActive = id !== undefined && tile.deviceId === +id;
                    const isHighlighted = isHighlighteddeviceIds.includes(tile.deviceId);
                 
                    return (
                        <div key={tile.deviceId} className="tile-device">
                            <Tile
                                id={tile.deviceId}
                                hasData={Boolean(tile.readingDate)}
                                data={tile}
                                active={isActive}
                                highlight={isHighlighted} 
                                    >
                            </Tile>
                        </div>
                    );
                })}
            </div>}
        </>
    )
}

export default DevicesState;

