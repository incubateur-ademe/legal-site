import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";
import { type JSX, type PropsWithChildren, useId } from "react";

import style from "./TableCustom.module.css";

export interface TableCustomProps {
  body: Array<Array<JSX.IntrinsicElements["td"]> | { className?: CxArg; row: Array<JSX.IntrinsicElements["td"]> }>;
  bodyRef?: React.Ref<HTMLTableSectionElement>;
  className?: CxArg;
  classes?: Partial<Record<"col" | "row" | "table" | `col-${number}`, CxArg>>;
  compact?: boolean;
  header: TableCustomHeadColProps[];
  showColWhenNullData?: boolean;
}
export const TableCustom = ({
  classes,
  compact,
  header,
  body,
  bodyRef,
  className,
  showColWhenNullData,
}: TableCustomProps) => {
  const tableId = (function useClosure() {
    return `table-custom-${useId()}`;
  })();

  return (
    <div id={tableId} className={cx(style.table, compact && style.tableCompact, className)}>
      <table className={cx(classes?.table)}>
        <thead className={style.tableHead}>
          <tr>
            {header.map((col, id) =>
              !showColWhenNullData && col.children === null ? null : (
                <TableCustomHeadCol
                  key={`${tableId}-head-col-${id}`}
                  {...col}
                  className={cx(classes?.[`col-${id}`], col.className)}
                />
              ),
            )}
          </tr>
        </thead>
        <tbody ref={bodyRef}>
          {body.map((row, rowId) => {
            const rowArray = Array.isArray(row) ? row : row.row;
            return (
              <tr
                key={`${tableId}-body-row-${rowId}`}
                className={cx(style.tableBodyRow, !Array.isArray(row) && row.className)}
              >
                {rowArray.map((bodyCol, colId) =>
                  !showColWhenNullData && bodyCol.children === null ? null : (
                    <TableCustomBodyRowCol
                      key={`${tableId}-body-col-${rowId}-${colId}`}
                      {...bodyCol}
                      className={cx(classes?.[`col-${colId}`], bodyCol.className)}
                    />
                  ),
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export interface TableCustomHeadColProps extends PropsWithChildren {
  className?: CxArg;
  colSpan?: JSX.IntrinsicElements["td"]["colSpan"];
  onClick?: JSX.IntrinsicElements["th"]["onClick"];
  orderDirection?: "asc" | "desc" | false;
}
export const TableCustomHeadCol = ({
  children,
  colSpan,
  orderDirection,
  onClick,
  className,
}: TableCustomHeadColProps) => (
  <th
    className={cx(style.tableHeadCol, onClick && style.tableHeadColClickable, className)}
    scope="col"
    colSpan={colSpan}
    onClick={onClick}
  >
    {children}
    {orderDirection && <span>{orderDirection === "asc" ? "⬆" : "⬇"}</span>}
  </th>
);

export const TableCustomBodyRowCol = ({ children, className, ...rest }: JSX.IntrinsicElements["td"]) => (
  <td {...rest} className={cx(style.tableBodyRowCol, className)}>
    {children}
  </td>
);
