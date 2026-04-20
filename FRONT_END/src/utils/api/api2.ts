import axios from "axios";

export const apiNoAuth = axios.create({
    baseURL : 'https://api.dictionaryapi.dev/api/v2/entries/en/',
    timeout : 5000,
});