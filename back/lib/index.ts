import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import { config } from './config';
import cors from 'cors';

class Index {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.connectToDatabase();
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`App listening on the port ${config.port}`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev'));

    // Middleware for CORS configuration
    this.app.use(cors({
      origin: '*', // Zmienić na rzeczywisty adres URL frontendu
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-access-token'], // Dodanie x-access-token
    }));

    // Static files middleware (optional, depends on your needs)
    this.app.use(express.static("public"));
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.databaseUrl);
      console.log('Connection with database established');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  }
}

export default Index;


/**import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import { config } from './config';
import logRequest from './middlewares/logRequest.middleware';
import cors from 'cors'; 

class Index {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.connectToDatabase();
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`App listening on the port ${config.port}`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev'));
    // this.app.use(logRequest);

  
    this.app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
      next();
    });

    this.app.use(express.static("public"));
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.databaseUrl);
      console.log('Connection with database established');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  }
}

export default Index;

/** 
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import { config } from './config';
import logRequest from './middlewares/logRequest.middleware';
import cors from 'cors'; // Importowanie cors

class Index {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.connectToDatabase();
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`App listening on the port ${config.port}`);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev'));
    // this.app.use(logRequest);

    const corsOptions = {
      origin: 'http://localhost:5175',
      //origin: 'http://localhost:',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
    };

    this.app.use(cors(corsOptions)); 

    this.app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    //  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
    //  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5175');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
      next();
    });

    this.app.use(express.static("public"));
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.databaseUrl);
      console.log('Connection with database established');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }

    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  }
}

export default Index;
**/
 