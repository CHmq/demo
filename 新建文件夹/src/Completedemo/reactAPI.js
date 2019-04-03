import axios from 'axios';

export const api = process.env.REACT_APP_RECORDS_API_URL || "http://localhost:8888/"


export const create = (body) =>
	axios.post(`${api}`, body)