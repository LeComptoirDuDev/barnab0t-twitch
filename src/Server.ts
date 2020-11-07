import express, { RequestHandler } from 'express';
import http from 'http';

export default class Server {
  readonly port: number;
  readonly app: express.Application;
  readonly http: http.Server;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.http = http.createServer(this.app);
  }

  start(startListener?: () => void) {
    this.app.use(express.static('public'));
    this.app.set('view engine', 'ejs');

    this.http.listen(this.port, () => {
      console.log(`Serveur lancé sur le port ${this.port}`);
      if (startListener) startListener();
    });
  }

  addRouteGet(route: string, handler: RequestHandler) {
    this.app.get(route, handler);
  }
}
