<template>
  <v-container class="Proveedores">
    <div class="d-flex flex-row-reverse">
      <div>
        <v-btn color="primary" @click="reload" icon>
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Usuarios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-select
            v-model="userTypeId"
            :items="userTypes"
            :item-text="`name`"
            :item-value="`id`"
            label="Tipo de usuario"
            class="mt-6 mr-10"
          ></v-select>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
            class="mr-10"
          ></v-text-field>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Usuario
              </v-btn>
            </template>
            <forms-admin-user
              v-if="dialog"
              :user="editedItem"
              :userTypes="userTypes"
              @created="created"
              @updated="updated"
              @close="dialog = false"
            />
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      </template>
      <template v-slot:no-data>
        <h3>No hay datos</h3>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
export default {
  layout: 'admin',
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    userTypeId: null,
    headers: [
      { text: 'Nombre', value: 'name' },
      { text: 'Correo', value: 'email' },
      { text: 'Acciones', value: 'actions' },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
    userTypes: [],
    loading: false,
  }),
  computed: {
    users() {
      return this.allUsers.filter((u) => u.userTypeId === this.userTypeId)
    },
  },
  watch: {
    dialog(val) {
      val || this.close()
    },
  },
  created() {},
  methods: {
    editItem(item) {
      this.editedIndex = this.allUsers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    updated(user) {
      let index = this.allUsers.findIndex((u) => u.id === user.id)
      Object.assign(this.allUsers[index], user)
      this.close()
    },
    created(user) {
      this.allUsers.push(user)
      this.close()
    },
    async reload() {
      this.loading = true
      await this.$nuxt.refresh()
      this.loading = false
    },
  },
  async asyncData({ env, store }) {
    store.commit('api/setEnv', env)
    let response,
      users = []
    try {
      response = await store.dispatch('api/list-users')
      users = response.users
    } catch (error) {
      console.log(error.response)
    }
    return { allUsers: users }
  },
  async fetch() {
    let response = await this.$store.dispatch('api/list-user-types')
    this.userTypes = response.userTypes
    if (this.userTypes.length > 0) this.userTypeId = this.userTypes[0].id
  },
  middleware: 'admin',
}
</script>
<style lang="scss" scoped>
.Proveedores {
  padding: 5rem;
}
</style>