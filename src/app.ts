import express, { Application, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

interface AppOptions {
    port: number;
    routes: Router;
}

export class App {
    public readonly app: Application;
    private readonly port: number;
    private readonly routes: Router;

    constructor(options: AppOptions) {
        this.port = options.port;
        this.routes = options.routes;
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    private setupRoutes() {
        this.app.use('/api', this.routes);
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}
