import type { RefCallback } from 'react';
import { memo, useCallback, useContext, useMemo } from 'react';
import { Thumbnail } from 'react-pdf';
import { PdfViewerContext } from './context';
import SpinView from './SpinView';

interface ThumbnailItemProps {
	page: number;
}

const ThumbnailItem = memo(({ page }: ThumbnailItemProps) => {
	const { thumbnailDoms, onThumbnailClick, current, space } =
		useContext(PdfViewerContext);
	const inputRef = useCallback<RefCallback<HTMLDivElement>>(
		ref => {
			if (thumbnailDoms) {
				thumbnailDoms[page - 1] = ref as HTMLDivElement;
			}
		},
		[thumbnailDoms, page]
	);

	const className = useMemo(
		() =>
			`border-solid border-black ${
				current === page ? ' opacity-100' : 'opacity-50'
			}`,
		[current, page]
	);

	// TODO: queryMedai width
	return (
		<>
			{page !== 1 && <div style={{ height: space }} />}
			<Thumbnail
				loading={<SpinView />}
				inputRef={inputRef}
				onItemClick={onThumbnailClick && onThumbnailClick}
				className={className}
				pageNumber={page}
				width={100}
				key={page}
			>
				<div className="absolute bottom-0 right-0 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center">
					{page}
				</div>
			</Thumbnail>
		</>
	);
});

const ThumbnailList = memo(() => {
	const { thumbnailScroll, space, total } = useContext(PdfViewerContext);
	const list = Array(total).fill('');

	// TODO: queryMedia width
	return (
		<div
			className="w-[160px] h-full overflow-y-scroll bg-white box-border"
			style={{ paddingTop: space, paddingBottom: space }}
			ref={thumbnailScroll}
		>
			<div className="flex flex-col items-center">
				{list.map((_, index) => (
					<ThumbnailItem page={index + 1} key={index} />
				))}
			</div>
		</div>
	);
});

export default ThumbnailList;
