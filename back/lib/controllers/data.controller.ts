import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';
import { checkIdParam } from '../middlewares/deviceIdParam.middleware';
import DataService from '../modules/services/data.service';
import { IData } from '../modules/models/data.model';
import Joi from 'joi';
import { auth } from '../middlewares/auth.middleware';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6]

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private dataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
        this.router.get(`${this.path}/:id`, checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id/latest`, checkIdParam, this.getPeriodData);
        this.router.get(`${this.path}/:id/:num`, checkIdParam, this.getPeriodData);
        this.router.delete(`${this.path}/all`, this.cleanAllDevices);
        this.router.delete(`${this.path}/:id/delete`, this.cleanDeviceDataByDateRange); 
        this.router.delete(`${this.path}/:id`, checkIdParam, this.cleanDeviceData);
    }

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { air, readingDate } = request.body;
        const { id } = request.params;

        const schema = Joi.object({
            air: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number().integer().positive().required(),
                        value: Joi.number().positive().required()
                    })
                )
                .unique((a, b) => a.id === b.id),
            deviceId: Joi.number().integer().positive().valid(parseInt(id, 10)).required(),
            readingDate: Joi.date().iso()
        });

        try {
            const validatedData = await schema.validateAsync({ air, deviceId: parseInt(id, 10) });
            const readingData: IData = {
                temperature: validatedData.air[0].value,
                pressure: validatedData.air[1].value,
                humidity: validatedData.air[2].value,
                deviceId: validatedData.deviceId,
                readingDate: validatedData.readingDate
            };
            
            console.log('Validated Data:', validatedData);
            console.log('Reading Data:', readingData);
            await this.dataService.createData(readingData);
            response.status(200).json(readingData);
        } catch (error) {
            console.error(`Validation Error: ${(error as Error).message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };

    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        console.log(allData);
        response.status(200).json(allData);
    };

    private getPeriodData = async (request: Request, response: Response, next: NextFunction) => {
        const { id, num } = request.params;
        const limit = num ? +num : 1;

        if (isNaN(parseInt(id, 10))) {
            return response.status(400).send('Missing or invalid device ID parameter!');
        }

        const allData = await this.dataService.get(id, limit);
        response.status(200).json(allData);

    };


    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        const allData = await this.dataService.getAllNewest();
        response.status(200).json(allData);
    };

    

    private cleanDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        await this.dataService.deleteData({ deviceId: id });
        response.sendStatus(200);
    };

    private cleanAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        await this.dataService.deleteData({});
        response.sendStatus(200);
    };


    private cleanDeviceDataByDateRange = async (request: Request, response: Response, next: NextFunction) => {
        const { startDate, endDate } = request.body;
        const {id} = request.params;
        const deviceId = parseInt(id, 10);

        if (!startDate || !endDate) {
            return response.status(400).json({ error: 'Missing start date or end date.' });
        }

        try {
            console.log('id: '+ deviceId);
            await this.dataService.deleteDataByDateRange(deviceId, startDate, endDate);
            response.sendStatus(200);
        } catch (error) {
            console.error('Error deleting data by date range:', error);
            response.status(500).json({ error: 'Internal server error.' });
        }
    };
}

export default DataController;
