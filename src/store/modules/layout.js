import { set } from '@/utils/vuex'

const state = () => ({
    responsive: false,
    compact: false
});

export default (options) => ({
    namespaced: true,
    state: state(options),
    mutations: {
        SET_RESPONSIVE: set('responsive'),
        SET_COMPACT: set('compact')
    },
    getters: {},
    actions: {
        setResponsive({ commit }, payload) {
            commit('SET_RESPONSIVE', payload)
        },
        setCompact({ commit }, payload) {
            commit('SET_COMPACT', payload)
        },
    }
});
