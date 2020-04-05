<template>
  <div class="add-recipe container">
  <form @submit="submitRecipe" ref="form">
    <b-row>
      <div class="col-12 col-md-8 m-auto pt-5">
          <b-row class="pb-3">
            <b-col>
              <button type="submit" class="float-right btn btn-secondary">Save</button>
              <h2 class="pb-4">Add a new recipe</h2>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6">
              <b-row class="pb-3">
                <b-col>
                  <h6>Title</h6>
                  <b-input v-model="recipe.title" placeholder=""></b-input>
                </b-col>
              </b-row>
              <b-row class="pb-3">
                <b-col>
                  <h6>Short description</h6>
                  <b-input v-model="recipe.shortDescription" placeholder=""></b-input>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <div class="mb-2" v-if="recipe.images">
                <div class="mb-1" v-for="image of recipe.images">
                  {{ image.name }}<br  />
                </div>
              </div>
              <label for="file" class="btn btn-sm p-0 text-muted"><plus-icon></plus-icon> Upload</label>
              </label>
              <input hidden type="file" id="file" ref="file" @change="onFileChange" name="attachments" multiple class=""/>
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
              <b-col sm="3" class="pr-0">
                <b-input placeholder="Item" v-model="item.item"></b-input>
              </b-col>
              <b-col>
                  <template v-for="ingredient of item.ingredients">
                    <b-row class="pb-2">
                      <b-col sm="5 pr-0">
                        <b-input placeholder="Amount (grams)" v-model="ingredient.amount"></b-input>
                      </b-col>
                      <b-col sm="5 pr-0">
                        <b-input placeholder="Ingredient" v-model="ingredient.ingredient"></b-input>
                      </b-col>
                      <b-col sm="2" class="text">
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
                <b-col sm="3" class="pr-0">
                  <b-input placeholder="Bulk" v-model="step.category"></b-input>
                </b-col>
                <b-col>
                  <b-textarea rows="4" placeholder="Bulk for 3-4 hours" v-model="step.step"></b-textarea>
                </b-col>
              </b-row>
              <b-row class="pb-2" v-if="step.ingredients.length > 0" v-for="ingredient of step.ingredients">
                <b-col offset="3" sm="3" class="pr-0">
                  <b-input placeholder="100g" v-model="ingredient.amount"></b-input>
                </b-col>
                <b-col>
                  <b-input placeholder="White flour" v-model="ingredient.ingredient"></b-input>
                </b-col>
                <b-col sm="1" class="text">
                  <close-icon></close-icon>
                </b-col>
              </b-row>
              <b-row class="pb-2" v-if="step.timeBreak.length > 0" v-for="timeBreak of step.timeBreak">
                <b-col sm="3" offset="3" class="pr-0">
                  <b-input @blur="processTimeInput(timeBreak.timeMin)" v-model="timeBreak.timeMin" placeholder="Min"></b-input>
                </b-col>
                <b-col sm="3" class="pr-0">
                  <b-input @blur="processTimeInput(timeBreak.timeMax)" v-model="timeBreak.timeMax" placeholder="Max"></b-input>
                </b-col>
                <b-col sm="3" size="sm" class="pr-0">
                  <b-dropdown v-model="timeBreak.activePassive" :text="timeBreak.activePassive === 'active' ? 'Active' : 'Passive'">
                    <b-dropdown-item-button @click="timeBreak.activePassive = 'active'" value="active">Active</b-dropdown-item-button>
                    <b-dropdown-item-button  @click="timeBreak.activePassive = 'passive'" value="passive">Passive</b-dropdown-item-button>
                  </b-dropdown>
                </b-col>
              </b-row>
              <b-row v-if="step.timeBreak.length > 0" >
                <b-col offset="3">
                  <b-link @click="addTimeBreak(step.timeBreak)"><plus-icon></plus-icon>Time step</b-link>
                  <hr />
                </b-col>
              </b-row>
              <b-row>
                <b-col offset="3">
                  <b-btn size="sm" class="mb-1" @click="addIngredientToStep(step)"><plus-icon></plus-icon>Ingredient</b-btn><br />
                  <b-btn size="sm" @click="addTimeBreakToStep(step)"><plus-icon></plus-icon>Time Break</b-btn>
                </b-col>
              </b-row>
            </div>
            <b-row>
              <b-col class="mt-2">
                <b-link @click="addStep"><plus-icon></plus-icon>Step</b-link>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <hr />
                <h6>Recommended times</h6>
              </b-col>
            </b-row>
            <div class="mb-2" v-for="time of recipe.recommendedTimes">
              <b-row class="mb-2">
                <b-col sm="3" class="pr-0">
                  <label>Start time</label>
                </b-col>
                <b-col sm="3" class="pr-0">
                  <b-input placeholder="" v-model="time.startTime"></b-input>
                </b-col>
              </b-row>
            </div>
            <b-row>
              <b-col class="mt-2">
                <b-link @click="addRecommendedTime"><plus-icon></plus-icon>Add time</b-link>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <hr />
                <h6>Hide from recipe list?</h6>
              </b-col>
            </b-row>
            <div class="mb-2">
              <b-row class="mb-2">
                <b-col sm="3" class="pr-0">
                  <b-form-checkbox
                    id="showhide"
                    v-model="hide"
                    name="checkbox-1"
                    value="accepted"
                  >
                    Hide
                  </b-form-checkbox>
                </b-col>
              </b-row>
            </div>
      </div>
    </b-row>
    <b-row>
      <b-col class="m-auto" md="8" sm="12">
        <hr />
        <!-- <button type="submit" @click="submitRecipe" class="btn btn-secondary">Save</button> -->
        <button type="submit" class="btn btn-secondary">Save</button>
        <b-alert variant="danger">There was an error. Please try again.</b-alert>
      </b-col>
    </b-row>
    </form>
  </div>
</template>

<script>
import RecipeService from '@/services/RecipeService'
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
        hide: false,
        totalRecipeLength: 0,
        steps: [{
          'category': '',
          'step': '',
          'ingredients': [],
          'timeBreak': []
        }],
        recommendedTimes: [],
        ingredients: [{
          'item': '',
          'ingredients': [{
            'amount': '',
            'ingredient': ''
          }]
        }],
        images: null
      },
      preferences: {
        measurement: 'grams' // ounces, grams, volume
      },
      images_results: [],
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
    processTimeInput: function (timeBreakVal) {
      var timeBreakText = '' + timeBreakVal
      // If has hours or h, process into minutes
      if (timeBreakText.match('h') !== null) {
        timeBreakVal = Math.round(parseInt(timeBreakText.replace(/A-Za-z/gi, '').trim()) / 60)
      }
    },
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
        'timeMax': '',
        'activePassive': 'active'
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
    addTimeBreak (stepTimeBreak) {
      stepTimeBreak.push({
        'timeMin': '',
        'timeMax': '',
        'activePassive': 'active'
      })
    },
    addRecommendedTime () {
      this.recipe.recommendedTimes.push({
        'startTime': ''
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
      this.recipe.totalRecipeLength = 0
      for (var step of this.recipe.steps) {
        // Add up total time from maxes
        if (step.timeBreak[0] !== undefined) this.recipe.totalRecipeLength += Number(step.timeBreak[0].timeIdeal) || Number(step.timeBreak[0].timeMin)
      }
      // Determine flour total
      for (var item of this.recipe.ingredients) {
        item.totalFlour = 0
        for (var ingredient of item.ingredients) {
          item.totalFlour += ingredient.ingredient.match(/flour/gi) !== null ? Number(ingredient.amount) : 0
        }
      }
      // Assign star ratings
      this.recipe.ratings = [0, 0, 0, 0, 0]
    },
    onFileChange (attachment) {
      this.recipe.images = this.$refs.file.files
    },
    async submitRecipe (e) {
      e.preventDefault()

      var response = false

      if (this.recipe.images !== null) {
        var data = new FormData()
        for (var image of this.recipe.images) {
          data.append('file', image)
        }

        // data.append('file', this.attachments)
        response = await RecipeService.addImage(data)

        // Build response array
        for (var j in response.data.files) {
          var file = response.data.files[j]
          this.images_results.push({
            secure_url: file.secure_url,
            filename: file.originalname,
            attachment_id: file.image_id,
            resource_type: file.resource_type,
            format: file.format
          })
        }
        this.recipe.images = this.images_results
      }
      this.processRecipe()
      this.$store.dispatch('addRecipe', this.recipe)
    }
  }
}
</script>
