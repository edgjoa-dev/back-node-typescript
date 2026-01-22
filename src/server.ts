import { App } from './app';
import { envs } from './config/envs';
import { AppRoutes } from './modules/routes';
import { Database } from './shared/infrastructure/database';

async function main() {
    await Database.connect();
    const app = new App({
        port: envs.PORT,
        routes: AppRoutes.routes,
    });
    app.start();
}

main();
