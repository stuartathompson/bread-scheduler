<template>
  <div>
    ok...
  <b-row class="pb-3">
    <b-col>
      <h6>Title</h6>
      <b-input v-model="recipe.title" placeholder=""></b-input>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <h6>Description</h6>
      <b-textarea rows="6" v-model="recipe.description"></b-textarea>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <hr />
      <h6>Recipe Ingredients</h6>
    </b-col>
  </b-row>
  <template class="mb-2" v-for="item of recipe.ingredients">
    <b-row>
      <b-col md="3" class="pr-0">
        <b-input placeholder="Item" v-model="item.item"></b-input>
      </b-col>
      <b-col>
          <template v-for="ingredient of item.ingredients">
            <b-row class="pb-2">
              <b-col md="5 pr-0">
                <b-input placeholder="Amount (grams)" v-model="ingredient.amount"></b-input>
              </b-col>
              <b-col md="5 pr-0">
                <b-input placeholder="Ingredient" v-model="ingredient.ingredient"></b-input>
              </b-col>
              <b-col md="2" class="text">
                <close-icon></close-icon>
              </b-col>
            </b-row>
          </template>
      </b-col>
    </b-row>
    <b-row>
      <b-col offset="3" class="pb-4 mt-1">
        <b-link @click="addIngredientToItem(item)"><plus-icon></plus-icon>Ingredient</b-link>
      </b-col>
    </b-row>
  </template>
  <b-row>
    <b-col class="mt-2">
      <b-link @click="addItem"><plus-icon></plus-icon>Item</b-link>
    </b-col>
  </b-row>
    <b-row>
      <b-col>
        <hr />
        <h6>Steps</h6>
      </b-col>
    </b-row>
    <div class="mb-2" v-for="step of recipe.steps">
      <b-row class="mb-2">
        <b-col md="3" class="pr-0">
          <b-input placeholder="Bulk" v-model="step.category"></b-input>
        </b-col>
        <b-col>
          <b-textarea rows="4" placeholder="Bulk for 3-4 hours" v-model="step.step"></b-textarea>
        </b-col>
      </b-row>
      <b-row class="pb-2" v-if="step.ingredients.length > 0" v-for="ingredient of step.ingredients">
        <b-col offset="3" md="3" class="pr-0">
          <b-input placeholder="100g" v-model="ingredient.amount"></b-input>
        </b-col>
        <b-col>
          <b-input placeholder="White flour" v-model="ingredient.ingredient"></b-input>
        </b-col>
        <b-col md="1" class="text">
          <close-icon></close-icon>
        </b-col>
      </b-row>
      <b-row class="pb-2" v-if="step.timeBreak.length > 0" v-for="timeBreak of step.timeBreak">
        <b-col md="3" offset="3" class="pr-0">
          <b-input v-model="timeBreak.timeMin" placeholder="Min"></b-input>
        </b-col>
        <b-col md="3" class="pr-0">
          <b-input v-model="timeBreak.timeMin" placeholder="Max"></b-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col offset="3">
          <b-link @click="addIngredientToStep(step)"><plus-icon></plus-icon>Ingredient</b-link><br />
          <b-link @click="addTimeBreakToStep(step)"><plus-icon></plus-icon>Time Break</b-link>
        </b-col>
      </b-row>
    </div>
    <b-row>
      <b-col class="mt-2">
        <b-link @click="addStep"><plus-icon></plus-icon>Step</b-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// import RecordsService from '@/services/RecordsService'
// import moment from 'moment'
// import Datepicker from 'vuejs-datepicker'
// import FormData from 'form-data'

export default {
  name: 'recipeFields',
  data () {
    return {
    }
  }
  // data () {
  //   return {
  //     recipe: {
  //       title: '',
  //       description: '',
  //       steps: [{
  //         'category': '',
  //         'step': '',
  //         'ingredients': [],
  //         'timeBreak': []
  //       }],
  //       ingredients: [{
  //         'item': '',
  //         'ingredients': [{
  //           'amount': '',
  //           'ingredient': ''
  //         }]
  //       }]
  //     },
  //     preferences: {
  //       measurement: 'grams' // ounces, grams, volume
  //     },
  //     ingredientTableFields: [
  //       {
  //         key: 'amount'
  //       },
  //       {
  //         key: 'ingredient'
  //       }
  //     ]
  //   }
  // },
  // filters: {
  //   date: function (value) {
  //     // if (!value) return
  //     // console.log(moment)
  //     return moment(value).format('D MMM, YYYY')
  //   }
  // },
  // computed: {
  // },
  // components: {
  //   Datepicker
  // },
  // methods: {
  //   setPreference: function (preference, value) {
  //     this.preferences[preference] = value
  //   },
  //   convertMeasurement: function (ingredient) {
  //     ingredient.amount = Number(String(ingredient.amount).replace(/[A-Za-z]/gi, ''))
  //     if (this.preferences.measurement === 'grams') {
  //       // Return as default grams
  //       return ingredient.amount + 'g'
  //     } else if (this.preferences.measurement === 'ounces') {
  //       // Calculate to ounces
  //       return (ingredient.amount * 0.035274).toFixed(2) + 'oz'
  //     } else if (this.preferences.measurement === 'volume') {
  //       return (ingredient.amount / 120).toFixed(2) + 'cups'
  //     }
  //   },
  //   addRecipe () {
  //     console.log('adding!')
  //   },
  //   addTimeBreakToStep (step) {
  //     console.log(step)
  //     step.timeBreak.push({
  //       'timeMin': '',
  //       'timeMax': ''
  //     })
  //   },
  //   addItem () {
  //     this.recipe.ingredients.push({
  //       'item': '',
  //       'ingredients': [{
  //         'amount': '',
  //         'ingredient': ''
  //       }]
  //     })
  //   },
  //   addIngredientToItem (item) {
  //     item.ingredients.push({
  //       'amount': '',
  //       'ingredient': ''
  //     })
  //   },
  //   addIngredientToStep (step) {
  //     step.ingredients.push({
  //       'amount': '',
  //       'ingredient': ''
  //     })
  //   },
  //   addStep () {
  //     this.recipe.steps.push({
  //       'category': '',
  //       'step': '',
  //       'ingredients': [],
  //       'timeBreak': []
  //     })
  //   },
  //   submitRecipe () {
  //     console.log('ok', this.recipe)
  //     this.$store.dispatch('addRecipe', this.recipe)
  //   }
  // }
}
</script>
