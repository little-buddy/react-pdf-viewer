import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export default (http: AxiosInstance) => {
	http.interceptors.request.use((config: InternalAxiosRequestConfig) => config);
	http.interceptors.response.use(response => {
		// TODO 状态码非200的时候本身也会抛错
		if (response.status !== 200) {
			throw new Error(response.statusText);
		}

		return response;
	});
};
