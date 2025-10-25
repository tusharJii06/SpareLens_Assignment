// src/components/DataTable.jsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function DataTable({ rows }) {
    if (!rows || rows.length === 0) return <div>No rows</div>;

    const rowHeight = 52; 
    const headerHeight = 52;
    const footerHeight = 52;
    
    const dynamicHeight = Math.max(
        rowHeight + headerHeight + footerHeight,
        (rows.length * rowHeight) + headerHeight + footerHeight
    );
    
    const maxHeight = 500; 
    const finalHeight = Math.min(dynamicHeight, maxHeight);
    
    const columns = Object.keys(rows[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 150,
    }));

    const rowsWithId = rows.map((row, index) => ({
        ...row,
        id: index,
    }));

    return (
        <Box sx={{ height: finalHeight, width: '100%' }}>
            <DataGrid
                rows={rowsWithId}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: rows.length || 25, page: 0 } },
                }}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                checkboxSelection={false}
            />
        </Box>
    );
}