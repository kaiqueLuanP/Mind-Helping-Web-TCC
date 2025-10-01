import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.11.185.214:3333"
})

