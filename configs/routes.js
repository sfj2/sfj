export default {
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        title: 'It\'s a Girl!',
        handler: require('../components/Home')
    },
    about: {
        path: '/about',
        method: 'get',
        page: 'about',
        title: 'About',
        handler: require('../components/About')
    }
};
