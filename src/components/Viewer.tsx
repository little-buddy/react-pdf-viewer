import type { RefCallback } from 'react';
import { memo as ReactMemo, useCallback, useContext, useRef } from 'react';
import { Page } from 'react-pdf';
import type { PinchState } from '@use-gesture/react';
import { usePinch } from '@use-gesture/react';
import { useSpring } from '@react-spring/web';
import { PdfViewerContext } from './context';
import SpinView from './SpinView';

const ViewerItem = ReactMemo(({ page }: { page: number }) => {
	const { pageDoms, scale = 0 } = useContext(PdfViewerContext);

	const inputRef = useCallback<RefCallback<HTMLDivElement>>(
		ref => {
			if (pageDoms) {
				pageDoms[page - 1] = ref as HTMLDivElement;
			}
		},
		[page, pageDoms]
	);

	console.log(scale);

	return (
		<Page
			// renderMode="svg"
			className="shadow-lg"
			inputRef={inputRef}
			loading={<SpinView />}
			scale={scale / 100}
			pageNumber={page}
			// renderAnnotationLayer={false}
			// renderTextLayer={false}
			key={page}
		/>
	);
});

type PinchStateX = Omit<PinchState, 'memo'> & {
	memo?: [number, number, number, number];
};

const Viewer = ReactMemo(() => {
	const { total, pageScroll, onPageScroll, setScale } =
		useContext(PdfViewerContext);
	const listWrpaer = useRef<HTMLDivElement>(null);

	const list = Array(total).fill('');

	const [style, api] = useSpring(() => {
		return {
			x: 0,
			y: 0,
			scale: 0.2,
			rotateZ: 0,
			onChange: ({ value }) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				setScale?.(value.scale.toFixed(2) * 100);
			},
		};
	});

	usePinch(
		({
			origin: [ox, oy],
			first,
			movement: [ms],
			offset: [s, a],
			memo: _memo,
		}: PinchStateX) => {
			// setScale(s);
			let memo = _memo;
			if (first) {
				const { width, height, x, y } =
					listWrpaer.current!.getBoundingClientRect();
				const tx = ox - (x + width / 2);
				const ty = oy - (y + height / 2);
				memo = [style.x.get(), style.y.get(), tx, ty];
			}

			// @ts-expect-error 'memo' is possibly 'undefined'.
			const x = memo[0] - (ms - 1) * memo[2];
			// @ts-expect-error 'memo' is possibly 'undefined'.
			const y = memo[1] - (ms - 1) * memo[3];
			api.start({ scale: s, rotateZ: a, x, y });
			return memo;
		},
		{
			target: listWrpaer,
			pinch: { scaleBounds: { min: 0.04, max: 1 }, rubberband: true },
		}
	);

	return (
		<div className="flex-1 pt-4 pb-4 min-w-0">
			<div
				className="h-full w-full overflow-y-scroll overflow-x-hidden"
				ref={pageScroll}
				onScroll={onPageScroll && onPageScroll}
			>
				<div
					className="flex flex-col items-center space-y-4"
					ref={listWrpaer}
					// style={style}
				>
					{list.map((_, index) => (
						<ViewerItem page={index + 1} key={index} />
					))}
				</div>
			</div>
		</div>
	);
});

export default Viewer;
