import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/Home'
import Recipes from '@/components/Recipes'
import Recipe from '@/components/Recipe'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Register from '@/components/Register'
import Calendar from '@/components/Calendar'
import addRecipe from '@/components/AddRecipe'
import editRecipe from '@/components/EditRecipe'
import PageNotFound from '@/components/PageNotFound'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'Recipes',
      components: {
        default: Recipes
      }
    },
    {
      path: '/recipe/:id',
      name: 'Recipe',
      components: {
        default: Recipe
      },
      meta: {
        title: 'recipe.title'
      }
    },
    {
      path: '/about',
      name: 'About',
      components: {
        default: About
      }
    },
    {
      path: '/contact',
      name: 'Contact',
      components: {
        default: Contact
      }
    },
    {
      path: '/recipes/add',
      component: addRecipe,
      name: 'addrecipe'
    },
    {
      path: '/recipe/:id/edit',
      component: editRecipe,
      name: 'editRecipe'
    },
    {
      path: '/register',
      component: Register,
      name: 'register'
    },
    {
      path: '/logout',
      component: Logout,
      name: 'logout'
    },
    {
      path: '/calendar',
      component: Calendar,
      name: 'calendar'
    },
    {
      path: '*',
      component: PageNotFound
    }
  ]
})
