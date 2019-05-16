import Vue from 'vue'
import Router from 'vue-router'
import routes from './_route'
import store from '@/store'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})

router.beforeEach((to,from,next) => {
	// if(to.matched.some( m => m.meta.auth)){
  	if (to.meta.auth) {
    	// ����ҵ����Ҫ�޸ĵ�½�ж�����
	    if (store.state.isLogin) {
	      	next()
	    } else {
	      	
	      	Message('���ȵ�¼��')
	      	next({
	      		path: '/',
	      		query:{ Rurl: to.fullPath}
	      	})
	      	
          
        //   next()
	    }
	}else{
		next()
	}
})

export default router
