import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export default (http: AxiosInstance) => {
	http.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => ({
			...config,
			_startTime: Date.now(),
		})
		/*  */
	);
	http.interceptors.response.use(response => {
		const { config } = response;
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { _startTime } = config;
		const now = Date.now();
		console.log(
			`[${config.url}]\n start:${_startTime}\n end:${now}\n duration:${
				now - _startTime
			}ms`
		);
		return response;
		/*  */
	});
};
