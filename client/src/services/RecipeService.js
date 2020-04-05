import Api from '@/services/Api'

export default {
  recipes (params) {
    return Api().post('recipes', params)
  },

  addRecipe (params) {
    console.log('params', params)
    return Api().post('add_record', params, { headers: { 'Content-Type': 'application/json' } })
  },

  addImage (params) {
    return Api().post('add_image', params, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  updateRecipe (params) {
    return Api().put('recipe/' + params._id, params)
  },

  getRecipe (params) {
    return Api().get('recipe/' + params.id)
  },

  deleteRecord (id) {
    return Api().delete('records/' + id)
  },

  searchRecord (params) {
    return Api().post('search', params)
  }
}
