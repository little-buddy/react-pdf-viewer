import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RootComponent from './RootComponent';
import { persistor, store } from './store/reducers/store';
import http from '@/utils/http';

http
	.get('/api/banner?type=0&timestampAxios=1692108493149', {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		cancelToken: true,
	})
	.catch(e => console.log(e));

const App: React.FC = () => (
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<RootComponent />
		</PersistGate>
	</Provider>
);

export default App;
