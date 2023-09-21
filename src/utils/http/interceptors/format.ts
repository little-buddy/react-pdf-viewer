/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { isArray, isObject } from 'lodash';

const toCamelCase = (value: any): any => {
	if (isArray(value)) {
		return value.map(toCamelCase);
	}
	if (isObject(value)) {
		const keys = Object.keys(value);
		const _value: any = {};
		for (let i = 0; i < keys.length; i += 1) {
			const key: string = keys[i];
			const newKey = key.replace(/(_\w)|(-\w)/g, k => k[1].toUpperCase());
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			_value[newKey] = toCamelCase(value[key as keyof typeof value]);
		}
		return _value;
	}

	return value;
};

export const toSnackCase = (value: any): any => {
	if (isArray(value)) {
		return value.map(toSnackCase);
	}
	if (isObject(value)) {
		const keys = Object.keys(value);
		const _value: any = {};
		for (let i = 0; i < keys.length; i += 1) {
			const key: string = keys[i];
			const newKey = key
				.replace(/\.?([A-Z]+)/g, (_, y) => `_${y.toLowerCase()}`)
				.replace(/^_/, '');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			_value[newKey] = toSnackCase(value[key as keyof typeof value]);
		}
		return _value;
	}

	return value;
};

// format data standard
export default (http: AxiosInstance) => {
	http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
		// eslint-disable-next-line no-param-reassign
		config.data = toSnackCase(config.data);
		return config;
	});
	http.interceptors.response.use(response => {
		response.data = toCamelCase(response.data);

		return response;
	});
};
