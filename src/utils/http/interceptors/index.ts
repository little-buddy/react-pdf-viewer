import { AxiosInstance, CancelTokenSource } from 'axios';
import auth from './auth';
import format from './format';
import logger from './logger';
import cancel from './cancelRereq';
import error from './error';

const cancelQueue = new Map<string, CancelTokenSource>();

export const use = (http: AxiosInstance) => {
	// 中间件其实也是剥洋葱，最先调用的在最里层
	logger(http);
	cancel(http, cancelQueue);
	auth(http);
	format(http);
	error(http);
};
