import type { Dispatch, LegacyRef, SetStateAction } from 'react';
import React from 'react';
import type { OnItemClickArgs } from 'react-pdf/dist/cjs/shared/types';

interface PdfViewerContextValue<T> {
	total?: number;
	current?: number;
	scale?: number;
	pageScroll?: LegacyRef<T> | null;
	thumbnailScroll?: LegacyRef<T> | null;
	thumbnailDoms?: HTMLDivElement[];
	pageDoms?: HTMLDivElement[];
	setCurretn?: Dispatch<SetStateAction<number>>;
	space?: number;
	onThumbnailClick?: (args: OnItemClickArgs) => void;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	onPageScroll?: (e: UIEvent<HTMLDivElement>) => void;
}

export const PdfViewerContext = React.createContext<
	PdfViewerContextValue<HTMLDivElement>
>({});
