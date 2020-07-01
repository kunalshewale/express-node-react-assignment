import React from "react";
import Icon from "@material-ui/core/Icon";
import "./Pagination.scss";

const Pagination = ({
  gotoPage,
  previousPage,
  nextPage,
  setPageSize,
  pageCount,
  pageSize,
  canPreviousPage,
  canNextPage,
  pageIndex,
  pageOptions,
}) => (
  <>
    <div className="pagination">
      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        <Icon>first_page</Icon>
      </button>
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>
        <Icon>chevron_left</Icon>
      </button>
      <span className="paginationInfo">
        Page&nbsp;
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>
      </span>
      <button onClick={() => nextPage()} disabled={!canNextPage}>
        <Icon>chevron_right</Icon>
      </button>
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        <Icon>last_page</Icon>
      </button>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  </>
);

export default Pagination;
