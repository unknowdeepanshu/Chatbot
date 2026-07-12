import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:3040/api" });
export { api };
