import Database from "../database.js";
import { randomUUID } from "node:crypto";
import buildRoutePath from "../utils/build-route-path.js";

const database = new Database();

const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("/tasks");

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        complete_at: null,
        create_at: new Date(Date.now()),
        updated_at: null,
      };

      database.insert("/tasks", task);

      return res.writeHead(201).end("Task created.");
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const updated_at = new Date(Date.now());

      database.update("/tasks", id, {
        title,
        description,
        updated_at,
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      if (req.complete) {
        const { id } = req.params;
        const updated_at = new Date(Date.now());

        database.completed("/tasks", id, {
          updated_at,
          complete_at:true,
        });

        return res.writeHead(204).end("aqui");
      }
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("/tasks", id);

      return res.writeHead(204).end();
    },
  },
];

export default routes;
