import { makeAutoObservable } from "mobx";

class MyStore {
  progress = 0;
  loaded = false;
  files = [];

  constructor() {
    makeAutoObservable(this);
  }

  setProgress(value) {
    this.progress = value;
  }

  setLoaded(value) {
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

  addFile(value) {
    this.files.push(value);
  }

  removeFile(value) {
    console.log("hello");
    this.files = this.files.filter((f) => f !== value);

    console.log(this.files);
  }
}

const myStore = new MyStore();
export default myStore;
