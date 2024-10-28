// src/store/myStore.ts
import { makeAutoObservable } from "mobx";

export interface File {
  name: string;
  data: File[]; // Update this type to reflect your actual data structure
}

class MyStore {
  progress: number = 0;
  loaded: boolean = false;
  files: File[] = [];
  currentFile: File | null = null;
  gridLoading: boolean | null = false;
  alertActive: boolean = false;
  alertMessage: string = "";
  warningsMap = {};

  constructor() {
    makeAutoObservable(this);
  }

  setProgress(value: number) {
    this.progress = value;
  }

  setLoaded(value: boolean) {
    this.loaded = value;
  }

  incrementProgress() {
    if (this.progress < 100) {
      this.progress += 1;
    }
  }

  reset() {
    this.progress = 0;
    this.loaded = false;
  }

  addFile(file: File) {
    this.files.push(file);
  }

  removeFile(file: File) {
    this.files = this.files.filter((f) => f !== file);
  }

  setCurrentFile(file: File | null) {
    this.currentFile = file;
  }
  updateField(rowIndex, fieldKey, newValue, warning = null) {
    // Clone the currentFile data to trigger reactivity
    const updatedData = [...this.currentFile.data];
    const row = updatedData[rowIndex];

    if (row) {
      row.data = { ...row.data, [fieldKey]: newValue };
      if (warning) {
        row.warning = warning;
      } else {
        row.warning = row.warning?.filter((w) => !w.path.includes(fieldKey)); // Clear previous warnings for the field if resolved
      }
    }

    // Update currentFile with new reference to trigger reactivity
    this.currentFile = { ...this.currentFile, data: updatedData };
  }

  setGridLoading(value) {
    this.gridLoading = value;
  }

  setAlertActive(value) {
    this.alertActive = value;
  }

  setAlertMessage(value) {
    this.alertMessage = value;
  }
}

const myStore = new MyStore();
export default myStore;
