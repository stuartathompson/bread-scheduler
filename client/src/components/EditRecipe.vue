<template>
  <div class="add-recipe container pt-5">
    <b-modal id="modalPrevent_recipe" centered @ok="deleteRecipe" ok-variant="danger" title="Delete this record" header-bg-variant="dark" header-text-variant="light" ok-title="Delete">
      Are you sure you want to the recipe <span class="text-primary">{{recipe.title}}</span>?
    </b-modal>
    <form @submit="updateRecipe" ref="form">
    <b-row>
      <b-col class="m-auto" sm="12" md="8">
          <b-row>
            <b-col>
              <button type="submit" class="float-right btn btn-secondary">Save</button>
              <b-link class="text-secondary" :href="url"><arrow-left-icon></arrow-left-icon> Back to recipe</b-link>
              <h2 class="pt-2 pb-4">{{recipe.title}}</h2>
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
                  <b-textarea rows="3" v-model="recipe.shortDescription" placeholder=""></b-textarea>
                </b-col>
              </b-row>
              <b-row class="pb-3">
                <b-col>
                  <h6>Number of loaves</h6>
                  <b-input v-model="recipe.numberOfLoaves" placeholder=""></b-input>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
              <div class="mb-2" v-if="recipe.images">
                <div class="mb-1" v-for="image of recipe.images">
                  <img v-if="image.secure_url" class="w-100" :src="image.secure_url" />
                  {{ image.name }}<br  />
                </div>
              </div>
              <label for="file" class="btn btn-sm p-0 text-muted">
                <plus-icon></plus-icon>
                Upload
                  <template v-if="recipe.images && recipe.images[0] && recipe.images[0].name">a new</template>
                  <template v-else> an</template> image
                </label>
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
            <div>
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
            </div>
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
              <b-row v-if="step.ingredients.length > 0">
                <b-col offset="3">
                  <strong>For this step</strong>
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
              <b-row v-if="step.timeBreak.length > 0">
                <b-col offset="3">
                  <strong>Time breaks</strong>
                </b-col>
              </b-row>
              <b-row class="pb-2" v-if="step.timeBreak.length > 0" v-for="timeBreak of step.timeBreak">
                <b-col sm="2" offset="3" class="pr-0">
                  <b-input v-on:blur="processTimeInput(timeBreak.timeMin)" v-model="timeBreak.timeMin" placeholder="Min"></b-input>
                </b-col>
                <b-col sm="2" class="pr-0">
                  <b-input v-on:blur="processTimeInput(timeBreak.timeMax)" v-model="timeBreak.timeMax" placeholder="Max"></b-input>
                </b-col>
                <b-col sm="2" class="pr-0">
                  <b-input v-on:blur="processTimeInput()" v-model="timeBreak.timeIdeal" placeholder="Ideal"></b-input>
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
            <b-row>
              <b-col>
                <hr />
                <h6>Recommended times</h6>
              </b-col>
            </b-row>
            <div class="mb-2" v-for="time of recipe.recommendedTimes">
              <b-row class="mb-2">
                <b-col sm="3" class="pr-0">
                  <label class="mt-2">Start time (hours)</label>
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
                  Value: {{ recipe.hide }}
                  <b-form-checkbox
                    id="showhide"
                    v-model="recipe.hide"
                    name="showhide"
                    value="true"
                  >
                    Hide
                  </b-form-checkbox>
                </b-col>
              </b-row>
            </div>
      <b-col>
        <hr />
        Total recipe time: {{ recipe.totalRecipeLength | hours }}
        <p>
          <button type="submit" class="float-right btn btn-secondary">Save</button><br />
        </p>
        <b-link v-b-modal.modalPrevent_recipe class="pt-3 float-right text-danger text-medium">Delete this recipe</b-link>
        <b-alert variant="danger">There was an error. Please try again.</b-alert>
      </b-col>

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
  name: 'editRecipe',
  data () {
    return {
      preferences: {
        measurement: 'grams' // ounces, grams, volume
      },
      imageChanged: false,
      images_results: [],
      recipe_id: null,
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
    hours: function (value) {
      return Math.round(value / 60) + ' hours'
    },
    date: function (value) {
      // if (!value) return
      // console.log(moment)
      return moment(value).format('D MMM, YYYY')
    }
  },
  created () {
    this.auth()
  },
  computed: {
    recipe: function () {
      return this.$store.state.recipe
    },
    url: function () {
      return '#/recipe/' + this.recipe_id
    }
  },
  components: {
    Datepicker
  },
  methods: {
    processTimeInput: function (timeBreakVal) {
      console.log('ok')
      // var timeBreakText = '' + timeBreakVal
      // // If has hours or h, process into minutes
      // if (timeBreakText.match('h') !== null) {
      //   timeBreakVal = Math.round(parseInt(timeBreakText.replace(/A-Za-z/g, '').trim()) / 60)
      // }
      // console.log(timeBreakText)
      // return timeBreakVal
    },
    auth: function () {
      if (this.$store.state.authStatus) {
        this.getRecipe()
      } else {
        this.$router.push({name: 'login'})
      }
    },
    getRecipe: function (recipe) {
      // this.$router.push('recipe/' + recipe._id + '/edit')
      this.recipe_id = this.$route.path.replace('recipe', '').replace('edit', '').replace(/\//gi, '')
      if (!recipe) recipe = {_id: this.recipe_id}
      if (recipe._id !== '') {
        // window.location.hash = `${record._id}/edit`
        // this.$router.push({ path: `${recipe._id}/edit` })
        this.$store.dispatch('getRecipe', recipe)
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
      console.log('adding!')
    },
    addTimeBreak (stepTimeBreak) {
      stepTimeBreak.push({
        'timeMin': '',
        'timeMax': '',
        'timeIdeal': '',
        'activePassive': 'active'
      })
    },
    addTimeBreakToStep (step) {
      console.log(step)
      if (!step.timeBreak) step.timeBreak = []
      step.timeBreak.push({
        'timeMin': '',
        'timeMax': '',
        'timeIdeal': '',
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
    addRecommendedTime () {
      if (!this.recipe.recommendedTimes) this.recipe.recommendedTimes = []
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
    },
    onFileChange (attachment) {
      console.log('file change', this.$refs.file.files)
      this.imageChanged = true
      this.recipe.images = this.$refs.file.files
    },
    async deleteRecipe () {
      console.log(this.$route.params.id)
      await RecipeService.deleteRecord(this.$route.params.id)
      this.$router.push({ name: 'Recipes' })
    },
    // updateRecipe () {
    //   this.processRecipe()
    //   console.log('ok', this.recipe)
    //   this.$store.dispatch('updateRecipe', this.recipe)
    // }
    //
    async updateRecipe (e) {
      e.preventDefault()

      var response = false
      console.log('imgs', this.recipe.images)

      if (this.imageChanged && this.recipe.images !== null) {
        var data = new FormData()
        for (var image of this.recipe.images) {
          data.append('file', image)
        }
        console.log('formdata', data)
        // data.append('file', this.attachments)
        response = await RecipeService.addImage(data)

        console.log('image response')

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

      console.log('ok done with image', this.recipe)
      this.processRecipe()
      this.$store.dispatch('updateRecipe', this.recipe)
    }
  }
}
</script>
