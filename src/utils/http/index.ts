import Axios, { AxiosInstance } from 'axios';
import { use } from './interceptors/index';
import { isDevelopment } from '@/utils';

const { REACT_APP_BUILD_BASE_URL, REACT_APP_CI_BASE_URL } = process.env;

const baseURL = isDevelopment
	? ''
	: REACT_APP_CI_BASE_URL || REACT_APP_BUILD_BASE_URL;

const http: AxiosInstance = Axios.create({
	withCredentials: true,
	baseURL,
	timeout: 30000,
});

use(http);

export default http;
