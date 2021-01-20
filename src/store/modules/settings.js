let domain = window.location.origin.replace("8080", "3000") + "/";

domain = 'https://namesfor.herokuapp.com/' //http://192.168.1.10:3000

const state = () => ({
  apiUrl: domain + 'v1/api/',
  // user
  baseNames: 'names/',
});

export default (options) => ({
    namespaced: true,
    state: state(options),
    mutations: {
       
    },
    actions: {
       
    },
    getters: {

    }
});
