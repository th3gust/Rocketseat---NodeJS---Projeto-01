import http from "node:http";
import { json } from "./middlewares/json.js";
import routes from "./middlewares/routes.js";

//criando o server
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routesParams = req.url.match(route.path);

    req.params = { ...routesParams.groups };

    const completeParams = routesParams.input.split('/');
    req.complete = completeParams.includes('complete');

    return route.handler(req, res);
  }
  //o response para quem não cair nos if's será o 404

  return res.writeHead(404).end();
});

//abrindo uma porta para os requests

server.listen(3333);
