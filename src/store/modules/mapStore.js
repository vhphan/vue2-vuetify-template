import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
    state: {
        mapSettings: {},
        defaultZoom: 14,
                lastCenter: null,
        lastZoom: null,
        region: 'CENTRAL',
        centers: {
            'CENTRAL': [3.03046, 101.5633],
            'EASTERN': [4.9364, 102.1591],
            'SABAH': [5.400, 116.389],
            'SARAWAK': [1.5869222, 110.2034863],
        },

    },
    mutations: {},
    actions: {},
    getters: {
        center: state => state.lastCenter ? state.lastCenter : state.centers[state.region],
        zoom: state => state.lastZoom ? state.lastZoom : state.defaultZoom,
    }
};

