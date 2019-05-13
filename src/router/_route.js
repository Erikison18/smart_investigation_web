const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const teleScreening = r => require.ensure([], () => r(require('@/page/teleScreening')), 'teleScreening');
const keyTrace = r => require.ensure([], () => r(require('@/page/keyTrace')), 'keyTrace');
const electronicFence = r => require.ensure([], () => r(require('@/page/electronicFence')), 'electronicFence');
const personManage =r => require.ensure([],()=> r(require('@/page/personManage')),'personManage')


const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/home',
		component: home,
		meta:{auth:true},
        children:[
            {
                path:'/teleScreening',
                component:teleScreening,
                meta:{auth:true},
            },
            {
                path:'/keyTrace',
                component:keyTrace,
                meta:{auth:true},
            },
            {
                path:'/electronicFence',
                component:electronicFence,
                meta:{auth:true},
            },
            {
                path:'/personManage',
                component:personManage,
                meta:{auth:true},
            }
        ]
	},

]

export default routes
