import type React from 'react';
import type { File } from 'react-pdf/dist/cjs/shared/types';
import PdfViewer from '@/components/PdfViewer';
import pdffile from '@/assets/law.pdf';

// http
// 	.get('/api/banner?type=0&timestampAxios=1692108493149', {
// 		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// 		// @ts-ignore
// 		cancelToken: true,
// 	})
// 	.catch(e => console.log(e));

const App: React.FC = () => (
	<PdfViewer file={pdffile as File} />
	// <Provider store={store}>
	// 	<PersistGate loading={null} persistor={persistor}>
	// 		<RootComponent />
	// 	</PersistGate>
	// </Provider>
);

export default App;
