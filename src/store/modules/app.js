import { set } from '@/utils/vuex'

const BAR_COLORS = {
    home: "#626b6e",
    other: "#fff"
};

const stateFn = () => ({
    drawer: false,
    menu: true,
    overlay: false,
    bar: {
        visible: true,
        color: BAR_COLORS.other,
        hideOnScroll: true,
        dark: false
    },
    barColor: BAR_COLORS.OTHER,
    publicPath: process.env.BASE_URL,
    mobile: {
        tab: null
    }
});

export default (options) => {
    const state = stateFn()
    return {
        namespaced: true,
        state,
        mutations: {
            SET_TAB: set('tab', state.mobile),
            SET_DRAWER: set('drawer'),
            SET_MENU: set('menu'),
            SET_OVERLAY: set('overlay'),
            SET_BAR: (state, payload) => {
                if (payload.key === "color") {
                    state.bar[payload.key] = BAR_COLORS[payload.value];
                } else {
                    state.bar[payload.key] = payload.value;
                }
            },
        },
        actions: {
            setTab({ commit }, payload) {
                commit('SET_TAB', payload)
            },
            setDrawer({ commit }, payload) {
                commit('SET_DRAWER', payload)
            },
            setMenu({ commit }, payload) {
                commit('SET_MENU', payload)
            },
            setOverlay({ commit }, payload) {
                commit('SET_OVERLAY', payload)
            },
            setBar({ commit }, payload) {
                commit('SET_BAR', payload)
            }
        },
        getters: {

        }
    }

};
