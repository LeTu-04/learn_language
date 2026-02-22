
import type { Vocabulary } from "../types/vocab";
import axios, { type AxiosInstance } from 'axios'

export class VocabService {
    private apiClient : AxiosInstance;
    constructor(baseUrl : string = 'http://localhost:3000'){
        this.apiClient = axios.create({
            baseURL : baseUrl,
            timeout : 10000,
            headers : {
                "Content-Type" : 'application/json'
            }
        })
    }
    async postVocab(data : Vocabulary[]) {
        const vocabPost = await this.apiClient.post<Vocabulary>('/vocab', data);
        return vocabPost.data;
    }

    async getVocab () {
        const vocab = await this.apiClient.get('/vocab');
        console.log(vocab)
        return vocab.data;
        
    }
}

export const vocabService = new VocabService();