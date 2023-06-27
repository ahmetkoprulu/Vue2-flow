import Vue from 'vue';
import Dev from './serve.vue';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faCropSimple, faClone, faTrash, faMagnifyingGlassPlus, faMagnifyingGlassMinus, faPaste, faCopy } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus, faCropSimple, faClone, faTrash, faMagnifyingGlassPlus, faMagnifyingGlassMinus, faPaste, faCopy);
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
