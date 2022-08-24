export const state = () => ({ env: {} })

export const mutations = {
  setEnv(state, value) {
    state.env = value
  },
}

export const actions = {
  getAxiosHeaders() {
    let token = this.$cookies.get('auth._token.local').split(' ')[1]
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  },
  async register({ state }, params) {
    const { API_URL } = state.env
    const promise = this.$axios.$post(`${API_URL}api/v1/auth/register`, params)
    return promise
  },
  async logout({ state, dispatch }) {
    const { API_URL } = state.env
    const headers = await dispatch('getAxiosHeaders')
    const promise = this.$axios.$post(`${API_URL}api/v1/auth/logout`, headers)
    return promise
  },
}
