var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pgPromise from "pg-promise";
const db = pgPromise()("postgres://postgres:12345@localhost:5432/exercise");
const setupDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.none(`
    DROP TABLE IF EXISTS planets;

    CREATE TABLE planets (
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT 
    );

    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
        id SERIAL NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        token TEXT
    )
    `);
    yield db.none(`INSERT INTO planets (name) VALUES ('Earth'), ('Mars')`);
    yield db.none(`INSERT INTO users (username, password) VALUES ('toby', 'ciao')`);
    const planets = yield db.many(`SELECT * FROM planets`);
    console.log(planets);
});
setupDb();
export { db };
