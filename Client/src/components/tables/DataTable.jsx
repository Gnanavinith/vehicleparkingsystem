import React from 'react';

const DataTable = ({ 
  columns, 
  data, 
  loading = false,
  onRowClick,
  className = ''
}) => {
  // Debug logging
  console.log('DataTable received data:', data);
  console.log('DataTable data type:', typeof data);
  console.log('DataTable is array:', Array.isArray(data));
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : [];
  
  console.log('DataTable processed array:', dataArray);
  console.log('DataTable array length:', dataArray.length);
  
  if (!dataArray || dataArray.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dataArray.map((row) => (
            <tr
              key={row.id || row._id || Math.random()} // Use id or _id if available
              className={`hover:bg-gray-50 cursor-pointer ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={`${row.id || row._id || 'row'}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : (row[column.key] == null || isNaN(row[column.key])) 
                      ? String(row[column.key]) 
                      : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
