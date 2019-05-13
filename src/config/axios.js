import { baseUrl } from './env'
import Vue from 'vue'
import axios from 'axios'

import Qs from 'qs'
axios.defaults.baseURL = baseUrl;

export default async(url , data , type = 'GET',method) => {
	type = type.toUpperCase()
	url = baseUrl + url

	switch (type) {
		case "GET":
			return axios.get(url,{
				params:data
			})
			break;
		case "LOGIN":
			return axios.post(url,Qs.stringify(data),{
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })
            break;
		case "POST":
			return axios.post(url,data)
			break;
		default:
			// statements_def
			break;
	}
}
