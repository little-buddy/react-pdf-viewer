/* eslint-disable @typescript-eslint/no-explicit-any */
import Axios, {
	AxiosInstance,
	CancelTokenSource,
	InternalAxiosRequestConfig,
} from 'axios';
import { isNil } from 'lodash';

export default (http: AxiosInstance, queue: Map<string, CancelTokenSource>) => {
	http.interceptors.request.use(
		(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
			const { cancelToken } = config;

			if (isNil(cancelToken) || cancelToken instanceof Axios.CancelToken) {
				return config;
			}

			const cancelSource = Axios.CancelToken.source();
			const uniqueId = (cancelToken as any).toString();
			const mapKey = `${config.url}:${uniqueId}`;
			if (queue.has(mapKey)) {
				const msg = `[${config.url}][${uniqueId}]: Cancel request After re-request`;
				queue.get(mapKey)?.cancel(msg);
				queue.delete(mapKey);
			}
			queue.set(mapKey, cancelSource);
			const newConfig = {
				...config,
				cancelToken: cancelSource.token,
			};

			return newConfig;
		}
	);
	http.interceptors.response.use(
		response =>
			/*  */
			response
	);
};
