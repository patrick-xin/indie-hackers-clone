import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';

import { DashboardLayout } from '@/features/layout/Dashboard';
import { trpc } from '@/utils/trpc';

function AdminUsers() {
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });
  const { data, isLoading } = trpc.useQuery(
    ['admin.users', { query: { page: pageIndex, pageCount: pageSize } }],
    {
      keepPreviousData: true,
    }
  );

  const fost = data?.users?.[0];

  const [globalFilter, setGlobalFilter] = React.useState('');
  const columnHelper = createColumnHelper<typeof fost>();
  const columns = React.useMemo<ColumnDef<typeof fost>[]>(
    () => [
      columnHelper.display({
        id: 'actions',
        cell: (props) => <RowActions row={props.row} />,
      }),
      columnHelper.group({
        header: 'Name',
        footer: (props) => props.column.id,

        columns: [
          {
            accessorFn: (row) => row?.username,
            id: 'userName',
            cell: (info) => info.getValue(),
            header: () => <span>User Name</span>,
            footer: (props) => props.column.id,
            sortingFn: fuzzySort,
          },
        ],
      }),
      columnHelper.group({
        header: 'Info',
        footer: (props) => props.column.id,
        columns: [
          {
            header: 'Email',
            footer: (props) => props.column.id,
            columns: [
              {
                accessorFn: (row) => row?.email,
                id: 'email',
                cell: (info) => info.getValue(),
                header: () => <span>Email</span>,
                footer: (props) => props.column.id,
              },
            ],
          },
          {
            header: 'Role',
            footer: (props) => props.column.id,
            columns: [
              {
                accessorFn: (row) => row?.role,
                id: 'role',
                cell: (info) => info.getValue(),
                header: () => <span>Role</span>,
                footer: (props) => props.column.id,
              },
            ],
          },
          {
            header: 'Posts',
            footer: (props) => props.column.id,
            columns: [
              {
                accessorFn: (row) => row?._count.posts,
                id: 'posts',
                cell: (info) => info.getValue(),
                header: () => <span>Posts</span>,
                footer: (props) => props.column.id,
              },
            ],
          },
        ],
      }),
    ],
    []
  );

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: data?.users ?? [],
    columns,
    pageCount: data?.totalCount ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    debugTable: true,
    getSortedRowModel: getSortedRowModel(),
  });

  // React.useEffect(() => {
  //   if (table.getState().columnFilters[0]?.id === 'fullName') {
  //     if (table.getState().sorting[0]?.id !== 'fullName') {
  //       table.setSorting([{ id: 'fullName', desc: false }]);
  //     }
  //   }
  // }, [table.getState().columnFilters[0]?.id]);
  if (isLoading) return null;
  return (
    <div className='p-2'>
      <h1>Total Users : {data?.totalCount}</h1>
      <div>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className='font-lg border-block border p-2 shadow'
          placeholder='Search all columns...'
        />
      </div>
      <div className='h-2' />
      <table className='table-fixed'>
        <thead>
          {table?.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    className='border-b p-4 pl-8 pt-0 pb-3 text-left font-medium text-slate-400 dark:border-slate-600 dark:text-slate-200'
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className='border-b border-slate-100 p-4 pl-8 text-slate-500 dark:border-slate-700 dark:text-slate-400'
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='h-2' />
      <div className='flex items-center gap-2'>
        <button
          className='rounded border p-1'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className='rounded border p-1'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className='rounded border p-1'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className='rounded border p-1'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className='flex items-center gap-1'>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {data?.pageCount}
          </strong>
        </span>
        <span className='flex items-center gap-1'>
          | Go to page:
          <input
            type='number'
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className='w-16 rounded border p-1'
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        {isLoading ? 'Loading...' : null}
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
    </div>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default AdminUsers;

AdminUsers.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

const RowActions = () => {
  return (
    <div>
      <button>edit</button>
    </div>
  );
};
