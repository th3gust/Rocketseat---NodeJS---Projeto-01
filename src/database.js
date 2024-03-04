import fs from "node:fs/promises";

const path = new URL("../db.json", import.meta.url);

class Database {
  #database = {};

  #persist() {
    fs.writeFile(path, JSON.stringify(this.#database));
  }

  constructor() {
    fs.readFile(path, "utf8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  select(table) {
    const data = this.#database[table] ?? [];

    this.#persist();

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = data;
    }

    return data;
  }

  update(table, id, data){
    const index = this.#database[table].findIndex((row) => row.id === id);
    if (index > -1){
      const {complete_at, create_at} = this.#database[table][index];
      
      this.#database[table][index] = {id, complete_at, create_at, ...data};
      this.#persist();
    }
  }

  completed(table, id, data){
    const index = this.#database[table].findIndex((row) => row.id === id);
    if (index > -1){
      const {create_at, title, description} = this.#database[table][index];
      
      this.#database[table][index] = {id, create_at, title, description, ...data};
      this.#persist();
    }
  }

  delete(table, id){
    const index = this.#database[table].findIndex((row) => row.id === id);
    if (index > -1){
      this.#database[table].splice(index, 1);
      this.#persist();
    }
  }
}

export default Database;
