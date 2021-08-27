import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
    state: {
        loading: false
    },
    actions: {
        setLoading(context, newValue) {
            context.commit('setLoading', newValue);
        },
    },
    mutations: {
        setLoading(state, value) {
            state.loading = value;
        },
    },
};