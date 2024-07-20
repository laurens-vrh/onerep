import { Header } from "@tanstack/react-table";

export function DataTableColumnDivider({
	header,
}: {
	header: Header<any, unknown>;
}) {
	return (
		<div
			className={`absolute top-0 right-0 w-2 h-full translate-x-1/2 ${
				header.column.getCanResize() ? "cursor-col-resize resize" : ""
			} select-none touch-none`}
			onMouseDown={header.getResizeHandler()}
			onTouchStart={header.getResizeHandler()}
		>
			<div className="mx-auto w-[1px] h-full bg-border pointer-events-none" />
		</div>
	);
}
