import type React from 'react';
import type { File } from 'react-pdf/dist/cjs/shared/types';
import PdfViewer from '@/components/PdfViewer';
import pdffile from '@/assets/law.pdf';

const App: React.FC = () => <PdfViewer file={pdffile as File} />;

export default App;
