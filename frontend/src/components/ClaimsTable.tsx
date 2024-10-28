import { useMemo } from "react"; // Import useMemo
import { AgGridReact } from "ag-grid-react";
import { Loader } from "@mantine/core";
import { observer } from "mobx-react-lite";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import myStore from "../store";

const ClaimsTable = observer(() => {
  const columnDefs = useMemo(() => {
    const columns = new Set<string>();

    if (myStore.currentFile) {
      myStore.currentFile.data.forEach((row: any) => {
        Object.keys(row.data).forEach((key) => {
          columns.add(key);
        });
      });
    }

    return Array.from(columns).map((key) => ({
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      field: key as string,
    }));
  }, [myStore.currentFile]);

  const rowData = useMemo(() => {
    if (!myStore.currentFile) return [];

    return myStore.currentFile.data.map((row: any) => row.data);
  }, [myStore.currentFile]);

  return (
    <div>
      <h1>Document: {myStore.currentFile ? myStore.currentFile.name : "No document selected"}</h1>
      {myStore.gridLoading === true && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
          <Loader size="lg" />
        </div>
      )}
      <div className="ag-theme-alpine" style={{ height: 400, width: 800, display: myStore.gridLoading === false ? "block" : "none" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout="autoHeight"
          pagination={true} // Enable pagination
          paginationPageSize={10}
          onGridReady={() => myStore.setGridLoading(true)} // Start loading when grid is ready
          onFirstDataRendered={() => myStore.setGridLoading(false)} // End loading when first data is rendered // Set the number of rows per page
        />
      </div>
    </div>
  );
});

export default ClaimsTable;
