import localforage from "localforage";
import localForage from "localforage";

localForage.config({
    driver: [
        localForage.INDEXEDDB,
        localForage.LOCALSTORAGE,
        localForage.WEBSQL,
    ],
    name: 'DashManager',
    version: 1.0,
});

export const DataStore: LocalForage = localforage.createInstance({
    name: "DashManager",
    storeName: "DataStore"
});