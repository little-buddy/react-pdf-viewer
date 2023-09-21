import type { HTMLAttributes, PropsWithChildren } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, Thumbnail, pdfjs } from 'react-pdf';
import type { File } from 'react-pdf/dist/cjs/shared/types';
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

export default function ({ file }: PdfViewerProps) {
	const [current, setCurretn] = useState(1);
	const [total, setTotal] = useState(0);
	const [scale, setScale] = useState(1);
	const container = useRef<HTMLDivElement>(null);
	const pageScroll = useRef<HTMLDivElement>(null);
	const thumbnailScroll = useRef<HTMLDivElement>(null);

	const thumbnailDoms: HTMLDivElement[] = useMemo(() => [], []);
	const pageDoms: HTMLDivElement[] = useMemo(() => [], []);

	// @ts-expect-error: yes
	const onPageScroll = (_: UIEvent<HTMLDivElement>) => {
		if (!container.current) {
			return;
		}
		const { height, top: pTop } = container.current.getBoundingClientRect();

		for (let i = 0; i < pageDoms.length; i += 1) {
			const bouding = pageDoms[i].getBoundingClientRect();
			const top = bouding.top - pTop;
			i === 0 && console.log(top);
			if (top > 0 && top < height / 2 && current !== i + 1) {
				setCurretn(i + 1);
			}
		}
	};

	const onThumbnailClick = (index: number) => {
		const dom = pageDoms[index - 1];
		const bouding = dom.getBoundingClientRect();

		pageScroll.current?.scrollTo({
			top: dom.offsetTop - 16,
			// behavior: 'smooth',
		});
		setCurretn(index);
	};

	useEffect(() => {
		if (thumbnailScroll.current) {
			const dom = thumbnailDoms[current - 1];

			const bouding = dom.getBoundingClientRect();

			const minTop = 0;
			const maxTop =
				(thumbnailScroll.current.offsetHeight || 0) - dom.offsetHeight;

			if (bouding.top > minTop && bouding.top < maxTop) {
				/*  */
			} else {
				// 判断中间距离来确定滚动方向的

				const { top: ttop } = dom.getBoundingClientRect();

				const top =
					ttop < 0
						? dom.offsetTop - 16
						: dom.offsetTop -
						  thumbnailScroll.current.offsetHeight +
						  dom.offsetHeight +
						  16;

				thumbnailScroll.current.scrollTo({
					top,
					behavior: 'smooth',
				});
			}
		}

		// 不完全可视，则需要进行滚动
	}, [current, thumbnailDoms, pageDoms]);

	return (
		<Document
			inputRef={container}
			className="bg-[#EEE] h-full overflow-hidden rounded-md broder border-solid border-[#00000063] relative"
			loading={
				<div className=" absolute inset-0 flex justify-center items-center">
					<Spin />
				</div>
			}
			file={file}
			onLoadError={e => {
				console.log(e.message);
			}}
			onLoadSuccess={({ numPages }) => {
				setTotal(numPages);
			}}
		>
			<div className="flex h-full">
				<div
					className="w-[160px] h-full overflow-y-scroll bg-white"
					ref={thumbnailScroll}
				>
					<div className=" flex flex-col items-center space-y-4 pt-4 pb-4 ">
						{Array(total)
							.fill(0)
							.map((_, index) => {
								const page = index + 1;
								return (
									<Thumbnail
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
											{page} {}
										</div>
									</Thumbnail>
								);
							})}
					</div>
				</div>

				<div className="flex-1 pt-4 pb-4">
					<div
						className="h-full w-full overflow-y-scroll"
						ref={pageScroll}
						onScroll={onPageScroll}
					>
						<div className="flex flex-col items-center space-y-4">
							{Array(total)
								.fill(0)
								.map((_, index) => (
									<Page
										inputRef={ref => {
											pageDoms[index] = ref as HTMLDivElement;
										}}
										scale={scale}
										pageNumber={index + 1}
										renderAnnotationLayer={false}
										renderTextLayer={false}
										key={index}
									/>
								))}
						</div>
					</div>
				</div>
			</div>

			<Row className=" absolute bottom-0">
				TotalPage: {total}
				<Button
					onClick={() => {
						setCurretn(current - 1);
					}}
				>
					Prev
				</Button>
				<Button
					onClick={() => {
						setCurretn(current + 1);
					}}
				>
					Next
				</Button>
				{/* <Slider value={scale} onChange={(value) => {
		    console.log(value)
		    setScale(value)
		  }} style={{ width: 100 }} /> */}
			</Row>
		</Document>
	);
}
