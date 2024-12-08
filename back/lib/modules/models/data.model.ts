export interface IData {
    temperature: number;
    pressure: number;
    humidity: number;
    deviceId: number;
    readingDate: Date;
    highlight?: boolean;
}

export type Query<T> = {
    [key: string]: T;
};


