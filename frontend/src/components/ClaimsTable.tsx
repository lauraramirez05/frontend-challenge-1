import { useMemo, useEffect } from "react"; // Import useMemo
import { AgGridReact } from "ag-grid-react";
import { Loader } from "@mantine/core";
import { observer } from "mobx-react-lite";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import myStore from "../store";
import { claimSchema } from "~/utils/schemas/claimSchema";

const ClaimsTable = observer(() => {
  const columnDefs = useMemo(() => {
    console.log("running");
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
      cellClass: (params) => {
        if (Array.isArray(params.data.warning)) {
          const warning = params.data.warning.find((w) => w.path && w.path.includes(key));
          return warning ? "bg-red-300" : "";
        }
        return "";
      },
      tooltipValueGetter: (params) => {
        // Check if warnings exist and are in an array
        if (Array.isArray(params.data.warning)) {
          // Iterate through the warnings to find one that matches the current column key
          const warning = params.data.warning.find((w) => w.path && w.path.includes(key));
          return warning ? warning.message : null; // Return the message if found, else null
        }
        return null; // Return null if no warnings
      },
      editable: true,
    }));
  }, [myStore.currentFile]);

  const rowData = useMemo(() => {
    if (!myStore.currentFile) return [];

    return myStore.currentFile.data.map((row: any) => ({
      ...row.data,
      warning: row.warning ? row.warning : undefined,
    }));
  }, [myStore.currentFile]);

  // Function to determine row class
  const getRowClass = (params) => {
    return params.data.warning ? "bg-red-100" : ""; // Tailwind class for light red background
  };

  const handleCellValueChanged = (params, event) => {
    const { rowIndex, data, colDef, newValue } = params;

    console.log("checking data", data);

    // Assert that colDef.field is a valid key in claimSchema
    const fieldKey = colDef.field as keyof typeof claimSchema.shape;

    // Create a schema for only the relevant field using the asserted key
    const fieldSchema = claimSchema.pick({ [fieldKey]: true });
    const result = fieldSchema.safeParse({ [fieldKey]: newValue });

    if (!result.success) {
      console.log(result);
      myStore.setAlertMessage(result.error.issues[result.error.issues.length - 1].message);
      myStore.setAlertActive(true);
      myStore.updateField(rowIndex, fieldKey, newValue, result.error.issues);
    } else {
      myStore.setAlertMessage("");
      myStore.setAlertActive(false);
      myStore.updateField(rowIndex, fieldKey, newValue);
    }

    // // Refresh the specific cell to reflect the warning update
    // params.api.refreshCells({ rowNodes: [params.node], force: true });
  };

  return (
    <div>
      <h1>Document: {myStore.currentFile ? myStore.currentFile.name : "No document selected"}</h1>
      {myStore.gridLoading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
          <Loader size="lg" />
        </div>
      )}
      {myStore.alertActive && (
        <Alert
          variant="light"
          color="red"
          radius="md"
          withCloseButton
          title="Alert title"
          icon={<IconInfoCircle />}
          onClose={() => {
            myStore.setAlertActive(false);
            myStore.setAlertMessage("");
          }}
        >
          {myStore.alertMessage}
        </Alert>
      )}
      <div className="ag-theme-alpine" style={{ height: 400, width: 800, display: myStore.gridLoading === false ? "block" : "none" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout="autoHeight"
          pagination={true} // Enable pagination
          paginationPageSize={10}
          onGridReady={() => myStore.setGridLoading(false)} // Start loading when grid is ready
          onFirstDataRendered={() => myStore.setGridLoading(false)} // End loading when first data is rendered // Set the number of rows per page
          getRowClass={getRowClass}
          tooltipShowDelay={0} // Show tooltip immediately
          tooltipMouseTrack={true} // Track the mouse for tooltips
          onCellEditingStopped={handleCellValueChanged}
        />
      </div>
    </div>
  );
});

export default ClaimsTable;
