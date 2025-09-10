import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export type TableColumn<T> = {
	key: keyof T | string;
	label: string;
	render?: (row: T) => React.ReactNode;
};

export type TableAction<T> = {
	label: string;
	onClick: (row: T) => void;
	icon?: React.ReactNode;
	className?: string;
};

interface TableProps<T> {
	columns: TableColumn<T>[];
	data: T[];
	actions?: TableAction<T>[];
	rowKey: (row: T) => string | number;
}

export function Table<T>({ columns, data, actions, rowKey }: TableProps<T>) {
	return (
		<div className="overflow-x-auto w-full">
			<table className="min-w-full rounded-lg bg-background-300">
				<thead>
					<tr className="border-b border-b-background-200">
						{columns.map((col) => (
							<th
								key={col.key as string}
								className="px-4 py-2 text-left font-semibold text-sm text-foreground"
							>
								{col.label}
							</th>
						))}
						{actions && actions.length > 0 && <th className="px-4" />}
					</tr>
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr className="border-b border-b-background-200">
							<td
								colSpan={columns.length + (actions?.length ? 1 : 0)}
								className="text-center text-foreground/50 py-2"
							>
								Нет данных
							</td>
						</tr>
					) : (
						data.map((row) => (
							<tr
								key={rowKey(row)}
								className="hover:bg-background-100 transition-colors border-b border-b-background-200"
							>
								{columns.map((col) => (
									<td key={col.key as string} className="py-2 px-4">
										{col.render
											? col.render(row)
											: (row[col.key as keyof T] as React.ReactNode)}
									</td>
								))}
								{actions && actions.length > 0 && (
									<td className="px-4 align-middle">
										<div className="flex items-center justify-center gap-2">
											{actions.map((action) => (
												<Button
													key={action.label}
													variant="icon"
													type="button"
													className={cn(
														`text-sm hover:scale-100 transition-all`,
														action.className,
													)}
													onClick={() => action.onClick(row)}
												>
													{action.icon}
													{action.label}
												</Button>
											))}
										</div>
									</td>
								)}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
