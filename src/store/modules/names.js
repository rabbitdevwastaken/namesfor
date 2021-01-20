import { set } from '@/utils/vuex'
import { getData } from '../../utils/helpers'

const stateFn = () => ({
    list: {
        male: [],
        female: []
    }
});

export default (options) => {
    const state = stateFn(options);

    return {
        namespaced: true,
        state,
        mutations: {
            SET_MALE: set('male', state.list),
            SET_FEMALE: set('female', state.list),
        },
        getters: {},
        actions: {
            setMale({ commit }, payload) {
                commit('SET_MALE', payload)
            },
            setFemale({ commit }, payload) {
                commit('SET_FEMALE', payload)
            },
            fetchData({ rootState }, payload = {}) {
                const {
                    apiUrl,
                    baseNames,
                } = rootState.settings;

                let query = "?";

                Object.keys(payload).forEach(key => {
                    query += `${key}=${payload[key]}&`;
                });

                let url = apiUrl + baseNames;

                return getData(url, query)
            },
        }
    }

};
