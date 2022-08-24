<template>
  <v-card>
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>{{ formTitle }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="name"
            label="Nombre"
            :rules="[rules.required]"
            prepend-icon="mdi-account"
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="Correo"
            type="email"
            :rules="[rules.required, rules.email]"
            prepend-icon="mdi-email"
          ></v-text-field>
          <v-text-field
            v-if="user.id"
            v-model="password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            :rules="
              password !== null && password !== ''
                ? [rules.required, rules.min]
                : []
            "
            prepend-icon="mdi-key"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-text-field
            v-else
            v-model="password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.min]"
            prepend-icon="mdi-key"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
          <v-select
            v-model="userTypeId"
            :items="userTypes"
            :item-text="`name`"
            :item-value="`id`"
            label="Tipo de usuario"
            prepend-icon="mdi-book-account"
            :rules="[rules.required]"
          ></v-select>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="$emit('close')">Cerrar</v-btn>
      <v-btn
        v-if="user.id"
        color="primary"
        text
        @click="update"
        :loading="clicked.update"
      >
        Guardar
      </v-btn>
      <v-btn
        v-else
        color="primary"
        text
        @click="create"
        :loading="clicked.create"
      >
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default: Object,
    },
    userTypes: {
      type: Array,
      default: [],
    }
  },
  data() {
    return {
      name: null,
      email: null,
      password: null,
      userTypeId: null,
      showPassword: false,
      rules: {
        required: (value) => !!value || 'Campo requerido',
        min: (v) => (!!v && v.length >= 8) || 'Deben ser minimo 8 caracteres',
        email: (v) => /.+@.+\..+/.test(v) || 'Correo inválido',
      },
      clicked: {
        create: false,
        update: false,
      },
    }
  },
  computed: {
    formTitle() {
      return this.user.id ? 'Editar Usuario' : 'Nuevo Usuario'
    },
  },
  watch: {},
  async mounted() {
    this.initialize()
  },
  methods: {
    async create() {
      this.clicked.create = true
      if (this.$refs.form.validate()) {
        try {
          let response
          let params = {
            name: this.name,
            email: this.email,
            password: this.password,
            userType: this.userTypeId,
          }
          response = await this.$store.dispatch('api/create-user', params)
          this.$toast.success('Información guardarda correctamente')
          this.$emit('created', response.user)
        } catch (error) {
          console.log(error.response)
          if (error.response.data.code)
            this.$toast.error(error.response.data.message)
        }
      }
      this.clicked.create = false
    },
    async update() {
      this.clicked.update = true
      if (this.$refs.form.validate()) {
        try {
          let response
          let params = {
            name: this.name,
            email: this.email,
            userTypeId: this.userTypeId,
          }
          if (this.password !== null && this.password !== '')
            params.password = this.password

          response = await this.$store.dispatch('api/update-user', {
            id: this.user.id,
            params: params,
          })
          response = await this.$store.dispatch('api/get-user', this.user.id)
          this.$toast.success('Información guardarda correctamente')
          this.$emit('updated', response.user)
        } catch (error) {
          console.log(error.response)
          if (error.response.data.code)
            this.$toast.error(error.response.data.message)
        }
      }
      this.clicked.update = false
    },
    initialize() {
      if (this.user.id) {
        this.name = this.user.name
        this.email = this.user.email
        this.userTypeId = this.user.userTypeId
      }
    },
  },
}
</script>
