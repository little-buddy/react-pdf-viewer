import type { Key } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, pdfjs } from 'react-pdf';
import type {
	DocumentCallback,
	File,
	OnItemClickArgs,
} from 'react-pdf/dist/cjs/shared/types';
import { PdfViewerContext } from './context';
import SpinView from './SpinView';
import Thumbnail from './Thumbnail';
import Viewer from './Viewer';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.bootcdn.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const options = {
	cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
	standardFontDataUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

interface PdfViewerProps {
	file: File;
	defaultScale?: number;
	space?: number;
	key?: Key;
}

// 这个值最好是计算出来的，而不是预先调整的，那页面间距就需要调整处理

function PdfViewer({ file, defaultScale = 100, space = 16 }: PdfViewerProps) {
	const [current, setCurretn] = useState(1);
	const [total, setTotal] = useState(0);
	const [scale, setScale] = useState(defaultScale);
	const container = useRef<HTMLDivElement>(null);
	const pageScroll = useRef<HTMLDivElement>(null);
	const thumbnailScroll = useRef<HTMLDivElement>(null);

	const thumbnailDoms: HTMLDivElement[] = useMemo(() => [], []);
	const pageDoms: HTMLDivElement[] = useMemo(() => [], []);

	const onPageScroll = useCallback(
		// @ts-expect-error Type 'UIEvent' is not generic.
		(_: UIEvent<HTMLDivElement>) => {
			if (!container.current || pageDoms.length < 1) {
				return;
			}
			const dom = pageDoms[0];
			const firstTop = dom.offsetHeight + space / 2;
			const { scrollTop } = pageScroll.current || { scrollTop: 0 };
			const curi =
				scrollTop < firstTop
					? 0
					: Math.floor((scrollTop - firstTop) / (dom.offsetHeight + space)) + 1;

			const topDom = pageDoms[curi];
			const diff = scrollTop - topDom.offsetTop;
			const minDiff = container.current.offsetHeight / 2 - space + space / 2;

			const cur =
				diff > -minDiff && diff < dom.offsetHeight + space - minDiff
					? curi + 1
					: curi + 2;

			if (cur !== current) {
				setCurretn(cur);
			}
		},
		[space, pageDoms, current]
	);

	const onThumbnailClick = useCallback(
		({ pageNumber }: OnItemClickArgs) => {
			const dom = pageDoms[pageNumber - 1];

			pageScroll.current?.scrollTo({
				top: dom.offsetTop - space,
			});
			setCurretn(pageNumber);
		},
		[space, pageDoms]
	);

	useEffect(() => {
		if (thumbnailScroll.current) {
			const dom = thumbnailDoms[current - 1];

			const minTop = thumbnailScroll.current.scrollTop;
			const maxTop =
				minTop + (container.current?.offsetHeight || 0) - dom.offsetHeight;

			if (dom.offsetTop > minTop && dom.offsetTop < maxTop) {
				/*  */
			} else {
				const ttop = dom.offsetTop - thumbnailScroll.current.scrollTop;

				const top =
					ttop < 0
						? dom.offsetTop - space
						: dom.offsetTop -
						  thumbnailScroll.current.offsetHeight +
						  dom.offsetHeight +
						  space;

				thumbnailScroll.current.scrollTo({
					left: 0,
					top,
					behavior: 'smooth',
				});
			}
		}
	}, [current, thumbnailDoms, pageDoms, space]);

	/* follow defaultScale */
	useEffect(() => {
		setScale(defaultScale);
	}, [defaultScale]);

	const onLoadSuccess = useCallback(({ numPages }: DocumentCallback) => {
		setTotal(numPages);
	}, []);

	const onLoadError = useCallback((e: Error) => {
		// TODO: do sth for error
		console.log(e.message);
	}, []);

	const state = useMemo(
		() => ({
			total,
			current,
			scale,
			pageScroll,
			thumbnailScroll,
			thumbnailDoms,
			pageDoms,
			space,
			onThumbnailClick,
			onPageScroll,
			setScale,
		}),
		[
			total,
			current,
			scale,
			pageScroll,
			thumbnailScroll,
			thumbnailDoms,
			pageDoms,
			space,
			onThumbnailClick,
			onPageScroll,
			setScale,
		]
	);

	return (
		<PdfViewerContext.Provider value={state}>
			<Document
				inputRef={container}
				className="bg-[#EEE] h-full w-full relative"
				loading={<SpinView />}
				file={file}
				onLoadError={onLoadError}
				onLoadSuccess={onLoadSuccess}
				options={options}
			>
				<div className="flex h-full">
					<Thumbnail />
					<Viewer />
				</div>
			</Document>
		</PdfViewerContext.Provider>
	);
}

export default memo(({ file, ...props }: PdfViewerProps) => (
	<PdfViewer file={file} key={file?.toString()} {...props} />
));
