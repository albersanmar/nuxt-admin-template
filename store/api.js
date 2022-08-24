export const state = () => ({
  env: {},
})

export const mutations = {
  setEnv(state, value) {
    state.env = value
  },
}

export const actions = {
  // Headers
  getAxiosHeaders() {
    let token = this.$cookies.get('auth._token.local').split(' ')[1]
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  },
  // Users
  'get-user': async function ({ state }, id) {
    const { API_URL } = state.env
    const promise = this.$axios.$get(`${API_URL}api/v1/users/${id}`)
    return promise
  },
  'list-users': async function ({ state }) {
    const { API_URL } = state.env
    const promise = this.$axios.$get(`${API_URL}api/v1/users`)
    return promise
  },
  'create-user': async function ({ state }, params) {
    const { API_URL } = state.env
    const promise = this.$axios.$post(`${API_URL}api/v1/users`, params)
    return promise
  },
  'update-user': async function ({ state }, { id, params }) {
    const { API_URL } = state.env
    const promise = this.$axios.$put(`${API_URL}api/v1/users/${id}`, params)
    return promise
  },
  // UserTypes
  'list-user-types': async function ({ state }) {
    const { API_URL } = state.env
    const promise = this.$axios.$get(`${API_URL}api/v1/user-types`)
    return promise
  },
}
