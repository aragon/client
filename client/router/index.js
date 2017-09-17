import Vue from 'vue'
import Router from 'vue-router'

import Home from 'views/home'
import HomeActionPanel from 'views/home/ActionPanel'
import HomeNavbar from 'components/home/Navbar'

import Tokens from 'views/tokens'
import TokensActionPanel from 'views/tokens/ActionPanel'
import TokensNavbar from 'components/tokens/Navbar'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        navbar: HomeNavbar,
        main: Home,
        action: HomeActionPanel
      }
    },
    {
      path: '/Tokens',
      name: 'tokens',
      components: {
        navbar: TokensNavbar,
        main: Tokens,
        action: TokensActionPanel
      }
    }
  ]
})
