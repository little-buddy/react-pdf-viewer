import type { HTMLAttributes, PropsWithChildren } from 'react';
import {
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Document, Page, Thumbnail, pdfjs } from 'react-pdf';
import type { DocumentCallback, File } from 'react-pdf/dist/cjs/shared/types';
import Spin from './Spin';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.bootcdn.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Button = ({
	children,
}: PropsWithChildren<HTMLAttributes<React.ReactNode>>) => <div>{children}</div>;
function Row({ children }: PropsWithChildren<HTMLAttributes<React.ReactNode>>) {
	return <div>{children}</div>;
}

// export default function PdfViewer() {
// 	return <Button />;
// }

interface PdfViewerProps {
	file: File;
}

const space = 16;

export default function ({ file }: PdfViewerProps) {
	const [current, setCurretn] = useState(1);
	const [total, setTotal] = useState(0);
	const [scale, setScale] = useState(100);
	const container = useRef<HTMLDivElement>(null);
	const pageScroll = useRef<HTMLDivElement>(null);
	const thumbnailScroll = useRef<HTMLDivElement>(null);
	const deferredScale = useDeferredValue(scale);

	const thumbnailDoms: HTMLDivElement[] = useMemo(() => [], []);
	const pageDoms: HTMLDivElement[] = useMemo(() => [], []);

	// @ts-expect-error normal
	const onPageScroll = (_: UIEvent<HTMLDivElement>) => {
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
	};

	const onThumbnailClick = (index: number) => {
		const dom = pageDoms[index - 1];

		pageScroll.current?.scrollTo({
			top: dom.offsetTop - space,
		});
		setCurretn(index);
	};

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
	}, [current, thumbnailDoms, pageDoms]);

	const onLoadSuccess = useCallback(({ numPages }: DocumentCallback) => {
		console.log('load successfully');
		setTotal(numPages);
	}, []);

	const onLoadError = useCallback((e: Error) => {
		console.log(e.message);
	}, []);

	const Loading = useMemo(
		() => (
			<div className=" absolute inset-0 flex justify-center items-center">
				<Spin />
			</div>
		),
		[]
	);

	return (
		<Document
			inputRef={container}
			className="bg-[#EEE] h-full rounded-md border-solid border-[#00000063] relative"
			loading={Loading}
			file={file}
			// options={{
			//   withCredentials: true,
			// }}
			onLoadError={onLoadError}
			onLoadSuccess={onLoadSuccess}
		>
			<div className="flex h-full">
				<div
					className="w-[160px] h-full overflow-y-scroll pt-4 pb-4 bg-white box-border"
					ref={thumbnailScroll}
				>
					<div className=" flex flex-col items-center space-y-4 ">
						{Array(total)
							.fill(0)
							.map((_, index) => {
								const page = index + 1;
								return (
									<Thumbnail
										loading={<Spin />}
										inputRef={ref => {
											thumbnailDoms[index] = ref as HTMLDivElement;
										}}
										onItemClick={() => onThumbnailClick(page)}
										className={`border-solid border-black ${
											current === page ? ' opacity-100' : 'opacity-50'
										}`}
										pageNumber={page}
										width={100}
										key={index}
									>
										<div className=" absolute bottom-0 right-0 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center">
											{page}
										</div>
									</Thumbnail>
								);
							})}
					</div>
				</div>

				<div className="flex-1 pt-4 pb-4 min-w-0">
					<div
						className="h-full w-full overflow-y-scroll overflow-x-hidden"
						ref={pageScroll}
						onScroll={onPageScroll}
					>
						<div className="flex flex-col items-center space-y-4">
							{Array(total)
								.fill(0)
								.map((_, index) => {
									return (
										<Page
											className=" shadow-lg"
											inputRef={ref => {
												pageDoms[index] = ref as HTMLDivElement;
											}}
											loading={<Spin />}
											scale={deferredScale / 100}
											pageNumber={index + 1}
											renderAnnotationLayer={false}
											renderTextLayer={false}
											key={index}
										/>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</Document>
	);
}
