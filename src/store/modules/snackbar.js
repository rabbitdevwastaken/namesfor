import { set } from '@/utils/vuex'

const state = () => ({
    top: false,
    bottom: true,
    left: false,
    right: false,
    color: 'info',
    snackbar: false,
    message: ''
});

export default (options) => ({
    namespaced: true,
    state: state(options),
    mutations: {
        SET_TOP: set('top'),
        SET_BOTTOM: set('bottom'),
        SET_LEFT: set('left'),
        SET_RIGHT: set('right'),
        SET_COLOR: set('color'),
        SET_SNACKBAR: set('snackbar'),
        SET_MESSAGE: set('message')
    },
    getters: {
        positon: (state) => {
            return {
                top: state.top,
                bottom: state.bottom,
                left: state.left,
                right: state.right
            }
        }
    },
    actions: {
        setPositon({ commit }, payload) {
            commit('SET_TOP', payload.top || false)
            commit('SET_BOTTOM', payload.bottom || false)
            commit('SET_LEFT', payload.left || false)
            commit('SET_RIGHT', payload.right || false)
        },
        setSnackbar({ commit }, payload) {
            commit('SET_SNACKBAR', payload)
        },
        setColor({ commit }, payload) {
            commit('SET_COLOR', payload)
        },
        setMessage({ commit }, payload) {
            commit('SET_MESSAGE', payload)
        },
        setState({ commit }, { snackbar = true, message = 'Server Error', color = 'red' }) {
            commit('SET_SNACKBAR', snackbar)
            commit('SET_MESSAGE', message)
            commit('SET_COLOR', color)
        }
    }
});
