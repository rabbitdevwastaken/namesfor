/**
 * Vuex
 *
 * @library
 *
 * https://vuex.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

let store;

export default (options) => {
  if (!store) {

    store = new Vuex.Store({
      modules: modules(options),
    })
  }

  return store;

}
