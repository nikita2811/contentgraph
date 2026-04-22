import axios from "axios";

const api = axios.create({
    baseURL: "https://backend.contentgraph.io",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;