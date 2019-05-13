import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import scroll from 'vue-seamless-scroll'



import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper)
Vue.use(scroll)//滚动
// 引入插件
import './plugins'

Vue.config.productionTip = false;



new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
