import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const token = '';
export default (http: AxiosInstance) => {
	http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
		const { headers } = config;

		// jwt token
		headers.Authorization = token;
		// 后端添加的
		headers['Access-Control-Allow-Origin'] = '*';

		return config;
	});
	http.interceptors.response.use(response => {
		console.log('Auth response');
		return response;
	});
};
