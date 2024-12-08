import DataModel from '../schemas/data.schema';
import {IData, Query} from "../models/data.model";

export default class DataService {

    public async createData(dataParams: IData) {
        try {
            const dataModel = new DataModel(dataParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(deviceID: string) {
        try {
            const data = await DataModel.find({deviceId: deviceID}, { __v: 0, _id: 0 });
            return data;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }


    public async get(deviceId: string, limit: number = 1) {
        try {
            const data = await DataModel.find({deviceId: deviceId}, { __v: 0, _id: 0 }).limit(limit).sort({$natural:-1})
            return data.reverse();
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getAllNewest() {
        const latestData:any = [];

        await Promise.all(
            Array.from({ length: 17 }, async (_, i) => {
                try {
                    const latestEntry = await DataModel.find({ deviceId: i  }, { __v: 0, _id: 0 }).limit(1).sort({$natural:-1});
                    // console.log(latestEntry)
                    if (latestEntry.length) {
                        latestData.push(latestEntry[0]);
                    } else {
                        latestData.push({deviceId: i});
                    }
                } catch (error) {
                    console.error(`Błąd podczas pobierania danych dla urządzenia ${i + 1}:  ${(error as Error).message}`);
                    latestData.push({});
                }
            })
        );

        return latestData.sort((a: IData, b:IData) => a.deviceId - b.deviceId);
    }


    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await DataModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async getByHours(deviceId: string, hours: number): Promise<IData[]> {
        const currentTime = new Date();
        const pastTime = new Date(currentTime.getTime() - (hours * 60 * 60 * 1000));

        return await DataModel.find({
            deviceId: parseInt(deviceId, 10),
            readingDate: { $gte: pastTime, $lte: currentTime }
        }).sort({ readingDate: -1 }).exec();
    }


    public extractHours(data: IData[]): string[] {
        return data.map(entry => {
            if (entry.readingDate) {
                const date = new Date(entry.readingDate);

                return date.toISOString().substring(11, 16); 
            } else {
                return ''; 
            }
        });
    }


    public async deleteDataByDateRange(deviceId: number, startDate: Date, endDate: Date) {
        try {
            await DataModel.deleteMany({
                deviceId: deviceId,
                readingDate: {
                    $gte: startDate,
                    $lt: endDate
                }
            });
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych z przedziału dat:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych z przedziału dat');
        }
    }
}
