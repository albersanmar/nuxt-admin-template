<template>
  <div class="d-flex flex-column align-center justify-center">
    <h1>¡Te damos la bienvenida!</h1>
    <v-form ref="form" v-model="valid" class="login__form" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Correo electrónico"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required, rules.min]"
        :type="show1 ? 'text' : 'password'"
        name="input-10-1"
        label="Contraseña"
        hint="At least 8 characters"
        counter
        @click:append="show1 = !show1"
      ></v-text-field>
      <div class="d-flex flex-row justify-center">
        <v-btn
          :disabled="!valid"
          color="primary"
          class="mr-4"
          @click="login"
          :loading="clicked.login"
        >
          Login
        </v-btn>
      </div>
    </v-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show1: false,
      password: '',
      rules: {
        required: (value) => !!value || 'Campo requerido',
        min: (v) => v.length >= 8 || 'Deben ser minimo 8 caracteres',
        emailMatch: () => `The email and password you entered don't match`,
      },
      valid: true,
      email: null,
      emailRules: [
        (v) => !!v || 'Campo requerido',
        (v) => /.+@.+\..+/.test(v) || 'Email no valido',
      ],
      clicked: {
        login: false,
      },
    }
  },
  methods: {
    async login() {
      this.clicked.login = true
      try {
        if (this.$refs.form.validate()) {
          await this.$auth.loginWith('local', {
            data: {
              email: this.email.replace(' ', ''),
              password: this.password,
            },
          })
          this.$router.push('/usuarios')
        }
      } catch (error) {
        console.log(error.response)
        if (error.response && error.response.data.code)
          this.$toast.error(error.response.data.message)
      }
      this.clicked.login = false
    },
  },
}
</script>
<style lang="scss" scoped>
.login {
  &__form {
    width: 100%;
  }
}
</style>
