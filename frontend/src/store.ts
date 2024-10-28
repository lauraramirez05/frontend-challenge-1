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

  setGridLoading(value) {
    this.gridLoading = value;
  }
}

const myStore = new MyStore();
export default myStore;
