import { defineStore } from 'pinia';

export const useTornadoStore = defineStore('tornadoes', {
    state: () => ({
        data: {},
    }),
    actions: {
        addToArray(arrObj) {
            this.data = arrObj;
        },
    },
});
