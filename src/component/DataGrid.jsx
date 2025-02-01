import React, { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

// Add custom CSS for the resizer
const styles = `
  .resizer {
    display: inline-block;
    width: 5px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(50%);
    z-index: 1;
    touch-action: none;
    background: rgba(0, 0, 0, 0.1);
    cursor: col-resize;
  }
  .resizer.isResizing {
    background: rgba(0, 0, 0, 0.5);
  }
`;

const DataGrid = () => {
  const [data, setData] = useState([]); // Original data from API
  const [savedData, setSavedData] = useState([]); // Saved data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]); // Sorting state
  const [globalFilter, setGlobalFilter] = useState(''); // Global filter state
  const [editingCell, setEditingCell] = useState(null); // Track which cell is being edited
  const [validationError, setValidationError] = useState(null); // Track validation errors
  const [columnResizeMode, setColumnResizeMode] = useState('onChange'); // Column resize mode
  const [columnVisibility, setColumnVisibility] = useState({}); // Column visibility state

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        setSavedData(result); // Initialize savedData with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns
  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      enableSorting: true,
      enableResizing: true, // Enable resizing for this column
      cell: (info) => info.getValue(), // Non-editable
    },
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      enableResizing: true, // Enable resizing for this column
      cell: (info) => {
        const isEditing = editingCell?.rowId === info.row.id && editingCell?.columnId === info.column.id;
        return isEditing ? (
          <input
            type="text"
            defaultValue={info.getValue()}
            onBlur={(e) => handleSave(info.row.id, info.column.id, e.target.value)}
            autoFocus
            className="form-control"
          />
        ) : (
          <div onClick={() => setEditingCell({ rowId: info.row.id, columnId: info.column.id })}>
            {info.getValue()}
          </div>
        );
      },
    },
    {
      accessorKey: 'username',
      header: 'Username',
      enableSorting: true,
      enableResizing: true, // Enable resizing for this column
      cell: (info) => {
        const isEditing = editingCell?.rowId === info.row.id && editingCell?.columnId === info.column.id;
        return isEditing ? (
          <input
            type="text"
            defaultValue={info.getValue()}
            onBlur={(e) => handleSave(info.row.id, info.column.id, e.target.value)}
            autoFocus
            className="form-control"
          />
        ) : (
          <div onClick={() => setEditingCell({ rowId: info.row.id, columnId: info.column.id })}>
            {info.getValue()}
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableSorting: true,
      enableResizing: true, // Enable resizing for this column
      cell: (info) => {
        const isEditing = editingCell?.rowId === info.row.id && editingCell?.columnId === info.column.id;
        return isEditing ? (
          <input
            type="email"
            defaultValue={info.getValue()}
            onBlur={(e) => handleSave(info.row.id, info.column.id, e.target.value)}
            autoFocus
            className="form-control"
          />
        ) : (
          <div onClick={() => setEditingCell({ rowId: info.row.id, columnId: info.column.id })}>
            {info.getValue()}
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      enableSorting: true,
      enableResizing: true, // Enable resizing for this column
      cell: (info) => {
        const isEditing = editingCell?.rowId === info.row.id && editingCell?.columnId === info.column.id;
        return isEditing ? (
          <input
            type="text"
            defaultValue={info.getValue()}
            onBlur={(e) => handleSave(info.row.id, info.column.id, e.target.value)}
            autoFocus
            className="form-control"
          />
        ) : (
          <div onClick={() => setEditingCell({ rowId: info.row.id, columnId: info.column.id })}>
            {info.getValue()}
          </div>
        );
      },
    },
  ];

  // Handle saving edited cell value
  const handleSave = (rowId, columnId, value) => {
    console.log('Saving:', { rowId, columnId, value }); // Debugging

    // Validation logic
    if (columnId === 'email' && !validateEmail(value)) {
      setValidationError('Invalid email address');
      return;
    }

    if (columnId === 'phone' && !validatePhone(value)) {
      setValidationError('Invalid phone number');
      return;
    }

    // Update savedData immutably
    const updatedData = savedData.map((row) =>
      row.id === rowId ? { ...row, [columnId]: value } : row
    );
    console.log('Updated Saved Data:', updatedData); // Debugging
    setSavedData(updatedData); // Update the savedData state
    setEditingCell(null); // Exit edit mode
    setValidationError(null); // Clear validation error
  };

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Phone validation
  const validatePhone = (phone) => {
    const regex = /^\d{10}$/; // Simple 10-digit validation
    return regex.test(phone);
  };

  // Table instance
  const table = useReactTable({
    data: savedData, // Use savedData instead of data
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    columnResizeMode, // Enable column resizing
  });

  if (loading) {
    return <div className="text-center my-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center my-4 text-danger">Error: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      {/* Add custom styles for the resizer */}
      <style>{styles}</style>

      {/* Global Filter (Search) */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="form-control"
        />
      </div>

      {/* Column Visibility Toggles */}
      <div className="mb-3">
        <label className="form-label">Toggle Columns:</label>
        <div className="d-flex flex-wrap gap-2">
          {table.getAllLeafColumns().map((column) => (
            <div key={column.id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                id={`toggle-${column.id}`}
              />
              <label className="form-check-label" htmlFor={`toggle-${column.id}`}>
                {column.columnDef.header}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="alert alert-danger" role="alert">
          {validationError}
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      position: 'relative',
                      width: header.getSize(), // Set column width
                    }}
                  >
                    <div
                      {...{
                        className: header.column.getCanSort() ? 'cursor-pointer' : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                    {/* Column Resizer */}
                    {header.column.getCanResize() && (
                      <div
                        {...{
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                            }`,
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(), // Set cell width
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <span className="me-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="form-select form-select-sm d-inline-block w-auto"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;