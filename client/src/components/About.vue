<template>
  <div class="add-recipe container pt-5 pb-5">
    <b-row>
      <b-col sm="6" class="m-auto text-center">
        <h1>Sourdough. Made easier.</h1>
        <p class="text-very-large text-hint">
          <timer-icon></timer-icon> Bread Scheduler helps you plan your bread-baking so you can focus on everything else that’s important to you. 
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="cover" style="background-image:url('static/bread1.jpg')"></div>
      </b-col>
    </b-row>
    <b-row class="mt-5">
      <b-col sm="4" class="">
        <h2><timer-icon class="text-very-large"></timer-icon>Bread Scheduler</h2>
        <p class="text-large">
          The scheduling tool makes planning your bakes a little easier. See each step in one simple view. Tweak the start and end times so you can plan your day. Your edits are saved automatically for next time.
        </p>
        <p class="">
          <span class="text-strong text-primary">Try it on this page right now!</span><br />
          Drag the calendar or the steps to make the recipe timing fit your schedule.
        </p>
      </b-col>
      <b-col>
        <Viz class="pb-3" :initialRecipe="getRecipe()"></Viz>
      </b-col>
    </b-row>
    <hr />
    <b-row class="mt-5 text-center">
      <b-col sm="4" class="">
        <img class="w-100 mb-2" src="static/timer.png" />
        <h3>Built-in Timers</h3>
        <p class="text-large">
          Each step in our collection of recipes includes built-in timers for each step so you can easily keep track of your progress without using any other tools.
        </p>
      </b-col>
      <b-col sm="4" class="">
        <h3>Add Your Own Recipes</h3>
        <p class="text-large">
          Paste your own recipes into our guide and upload them to the cloud. We’ll process them into <timer-icon></timer-icon> Bread Scheduler.
        </p>
      </b-col>
      <b-col sm="4" class="">
        <h3>Quick Plan Your Day</h3>
        <p class="text-large">
          Add steps for your existing recipes to help plan your bake without uploading the entire recipe.
        </p>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
import moment from 'moment'
// import Datepicker from 'vuejs-datepicker'
import Viz from '@/components/Viz'
// import FormData from 'form-data'

export default {
  name: 'addRecipe',
  data () {
    return {
      recipe: {
        title: '',
        description: '',
        totalRecipeLength: 0,
        steps: [{
          'category': '',
          'step': '',
          'ingredients': [],
          'timeBreak': []
        }],
        ingredients: [{
          'item': '',
          'ingredients': [{
            'amount': '',
            'ingredient': ''
          }]
        }]
      },
      preferences: {
        measurement: 'grams' // ounces, grams, volume
      },
      ingredientTableFields: [
        {
          key: 'amount'
        },
        {
          key: 'ingredient'
        }
      ]
    }
  },
  filters: {
    date: function (value) {
      // if (!value) return
      // console.log(moment)
      return moment(value).format('D MMM, YYYY')
    }
  },
  computed: {
  },
  components: {
    Viz
  },
  methods: {
    setPreference: function (preference, value) {
      this.preferences[preference] = value
    },
    convertMeasurement: function (ingredient) {
      ingredient.amount = Number(String(ingredient.amount).replace(/[A-Za-z]/gi, ''))
      if (this.preferences.measurement === 'grams') {
        // Return as default grams
        return ingredient.amount + 'g'
      } else if (this.preferences.measurement === 'ounces') {
        // Calculate to ounces
        return (ingredient.amount * 0.035274).toFixed(2) + 'oz'
      } else if (this.preferences.measurement === 'volume') {
        return (ingredient.amount / 120).toFixed(2) + 'cups'
      }
    },
    addRecipe () {
      // console.log('adding!')
    },
    addTimeBreakToStep (step) {
      // console.log(step)
      step.timeBreak.push({
        'timeMin': '',
        'timeMax': ''
      })
    },
    addItem () {
      this.recipe.ingredients.push({
        'item': '',
        'ingredients': [{
          'amount': '',
          'ingredient': ''
        }]
      })
    },
    addIngredientToItem (item) {
      item.ingredients.push({
        'amount': '',
        'ingredient': ''
      })
    },
    addIngredientToStep (step) {
      step.ingredients.push({
        'amount': '',
        'ingredient': ''
      })
    },
    addStep () {
      this.recipe.steps.push({
        'category': '',
        'step': '',
        'ingredients': [],
        'timeBreak': []
      })
    },
    processRecipe () {
      for (var step of this.recipe.steps) {
        if (step.timeBreak[0]) this.recipe.totalRecipeLength += step.timeBreak[0].timeMax
      }
      // console.log(this.recipe.totalRecipeLength)
    },
    getRecipe: function () {
      // console.log('get recipe about, hitting')
      // this.$router.push('recipe/' + recipe._id + '/edit')
      var getThisRecipe = {_id: this.recipe._id}
      if (getThisRecipe._id !== '') {
        // window.location.hash = `${record._id}/edit`
        // this.$router.push({ path: `${recipe._id}/edit` })
        this.$store.dispatch('getRecipe', getThisRecipe)
        return this.$store.state.recipe
      }
    },
    submitRecipe () {
      // console.log('ok', this.recipe)
      this.processRecipe()
      this.$store.dispatch('addRecipe', this.recipe)
    }
  }
}
</script>
