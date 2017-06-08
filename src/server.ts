"use strict";

import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import {setRoutes as setSourceRoutes} from "./api/sourcesRoutes";
import {setRoutes as setChannelsRoutes} from "./api/channelsRoutes";

export default class Server {
  private express: express.Application;

  constructor() {
    this.express = express();

    this.middleware();
    this.config();
    this.route();
  }

  private middleware() {
    this.express.use(logger('server'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
  }

  private config() {
    let port = 3000;
    this.express.listen(port, () => {
      console.log('listen on port ', port)
    });
  }

  private route() {
    this.express.use('/assets', express.static('./src/assets'));

    this.express.use('/sources', setSourceRoutes(express.Router()));
    this.express.use('/channels', setChannelsRoutes(express.Router()));
  }

}
