'use strict';

import * as SourcesService from "../dao/sourcesService";
import {Source} from "../model/source";

export function setRoutes(router) {
  function processError(res: any, promise: Q.Promise<any>) {
    promise.catch(function (e) {
      console.log(e);
      res.status(500).json({
        error: e
      });
    });
  }

  /**
   * Get all sources
   */
  router.get('/', function (req, res) {
    processError(
      res,
      SourcesService.getSources().then(function (sources) {
        res.json(sources);
      })
    );
  });

  /**
   * Get all sources
   */
  router.get('/source', function (req, res) {
    processError(
      res,
      SourcesService.get(req.query.id).then(function (source) {
        res.json(source);
      })
    );
  });

  /**
   * Add new source
   */
  router.post('/', function (req, res) {
    let [id, name, url, type] = req.query;
    let source = new Source(id, name, url, type);
    processError(
      res,
      SourcesService.add(source).then(function () {
        res.sendStatus(201);
      })
    );
  });

  /**
   * Edit source
   */
  router.put('/', function (req, res) {
    let [id, name, url, type] = req.query;
    let source = new Source(id, name, url, type);
    processError(
      res,
      SourcesService.update(source).then(function () {
        res.sendStatus(200);
      })
    );
  });

  /**
   * Delete source
   */
  router.put('/', function (req, res) {
    processError(
      res,
      SourcesService.removeSource(req.query.id).then(function () {
        res.sendStatus(200);
      })
    );
  });

  return router;
}
