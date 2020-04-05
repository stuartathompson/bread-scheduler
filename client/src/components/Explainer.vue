<template>
  <div class="add-recipe text-light bg-dark container-fluid w-100 mt-5 p-3 p-sm-5">
    <b-row class="pt-3">
      <b-col lg="6" class="m-auto text-left text-sm-center">
        <h1>Introducing the Bread Scheduler.</h1>
        <p class="text-large">
          Make your bake a little easier. See every step in one simple view. Then tweak everything to plan the perfect bake on your schedule.
        </p>
        <p class="">
          <span class="text-strong text-primary">Try it right now! Drag the calendar and steps.</span>
        </p>
      </b-col>
    </b-row>
    <b-container class="pb-5">
      <b-row class="rounded-corner bg-light text-dark mt-2">
        <b-col>
          <Viz class="pb-3" v-if="recipe && recipe.steps.length > 1" :initialRecipe="recipe"></Viz>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
import moment from 'moment'
// import Datepicker from 'vuejs-datepicker'
import Viz from '@/components/Viz'
// import FormData from 'form-data'

export default {
  name: 'Explainer',
  data () {
    return {
      initRecipe: this.initialRecipe
    }
  },
  props: ['initialRecipe'],
  mounted () {
    this.getRecipe()
  },
  filters: {
    date: function (value) {
      // if (!value) return
      // console.log(moment)
      return moment(value).format('D MMM, YYYY')
    }
  },
  computed: {
    // recipes: function () {
    //   return this.$store.state.recipes
    // }
    recipe: function () {
      // console.log('getting recipe from store', this.$store.state.recipe)
      return this.$store.state.recipe
    }
  },
  components: {
    Viz
  },
  methods: {
    getRecipe: function () {
      // console.log('1. getting', this.initRecipe)
      // this.$router.push('recipe/' + recipe._id + '/edit')
      var getThisRecipe = {_id: this.initRecipe._id}
      if (getThisRecipe._id !== '') {
        // window.location.hash = `${record._id}/edit`
        // this.$router.push({ path: `${recipe._id}/edit` })
        this.$store.dispatch('getRecipe', getThisRecipe)
        // this.recipe = this.$store.state.recipe
      }
    }
  }
}
</script>
