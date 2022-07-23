import Vue from 'vue'
import App from './App.vue'

import {
  BIconXCircle,
  BIconFiles,
  ButtonPlugin,
  CardPlugin,
  FormCheckboxPlugin,
  FormInputPlugin,
  FormSelectPlugin,
  FormTextareaPlugin,
  LayoutPlugin,
  NavbarPlugin,
  TabsPlugin
} from 'bootstrap-vue'

import './styles/custom.scss';

Vue.config.productionTip = true

Vue.use(ButtonPlugin)
Vue.use(CardPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormSelectPlugin)
Vue.use(FormTextareaPlugin)
Vue.use(LayoutPlugin)
Vue.use(NavbarPlugin)
Vue.use(TabsPlugin)
Vue.component('BIconFiles', BIconFiles)
Vue.component('BIconXCircle', BIconXCircle)

new Vue({
  render: h => h(App),
}).$mount('#app')
