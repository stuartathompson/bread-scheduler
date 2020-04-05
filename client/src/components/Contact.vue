<template>
  <div class="add-recipe container container-sm pt-5">
    <b-row class="pb-5 mb-5" style="border-bottom:1px solid #bbb">
      <b-col class="mb-3" sm="6">
        <img class="w-100" src="static/bread.jpg" />
      </b-col>
      <b-col sm="6">
        <h2>We love bread</h2>
        <p>
          Bread-baking is a great hobby. But it's a pain to plan around our busy schedules. We grew frustrated trying to plan bakes over two or three days without any good tools.
        <p>
          We started using Google Docs and recipe websites, double-checking ingredients, and trying to calculate the right time for each step. But we wanted a tool to handle this for us. And that's why we made <a href="/"><span class="text-primary"><timer-icon></timer-icon>Bread Scheduler</span></a>.
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form class="">
          <div class="pb-2">
            <h2>Get in touch</h2>
            <p>
              We'd love to hear from you. Have feedback, comments or suggestions? Let us know.
            </p>
            <p>
              Get in touch at <a class="text-primary" href="mailto:stuartathompson@gmail.com">stuartathompson@gmail.com</a>
              <p>
                Or ping me <a class="text-primary" href="http://twitter.com/stuartathompson">on Twitter</a> or <a class="text-primary" href="http://instagram.com/doughnt.stop.beleaven">Instagram</a> .
              </p>
            </p>
          </div>
          <!-- <b-input class="mb-2" placeholder="Your name"></b-input>
          <b-input class="mb-2" placeholder="Your email"></b-input>
          <b-textarea rows="4" class="mb-2" placeholder="Your message"></b-textarea>
          <b-btn variant="primary" type="submit">Send</b-btn> -->
        </b-form>
      </b-col>
      <b-col sm="6">
        <img class="w-100" src="static/bread-square.jpg" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
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
    Datepicker
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
      console.log('adding!')
    },
    addTimeBreakToStep (step) {
      console.log(step)
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
      console.log(this.recipe.totalRecipeLength)
    },
    submitRecipe () {
      console.log('ok', this.recipe)
      this.processRecipe()
      this.$store.dispatch('addRecipe', this.recipe)
    }
  }
}
</script>
