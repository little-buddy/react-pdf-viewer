import type { RefCallback } from 'react';
import { memo, useCallback, useContext } from 'react';
import { Page } from 'react-pdf';
import { PdfViewerContext } from './context';
import SpinView from './SpinView';

const ViewerItem = memo(({ page }: { page: number }) => {
	const { pageDoms, scale = 0 } = useContext(PdfViewerContext);

	const inputRef = useCallback<RefCallback<HTMLDivElement>>(
		ref => {
			if (pageDoms) {
				pageDoms[page - 1] = ref as HTMLDivElement;
			}
		},
		[page, pageDoms]
	);

	return (
		<Page
			className="shadow-lg"
			inputRef={inputRef}
			loading={<SpinView />}
			scale={scale / 100}
			pageNumber={page}
			renderAnnotationLayer={false}
			renderTextLayer={false}
			key={page}
		/>
	);
});

const Viewer = memo(() => {
	const { total, pageScroll, onPageScroll } = useContext(PdfViewerContext);

	const list = Array(total).fill('');

	return (
		<div className="flex-1 pt-4 pb-4 min-w-0">
			<div
				className="h-full w-full overflow-y-scroll overflow-x-hidden"
				ref={pageScroll}
				onScroll={onPageScroll && onPageScroll}
			>
				<div className="flex flex-col items-center space-y-4">
					{list.map((_, index) => (
						<ViewerItem page={index + 1} key={index} />
					))}
				</div>
			</div>
		</div>
	);
});

export default Viewer;
