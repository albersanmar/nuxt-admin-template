<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" color="primary" temporary fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in menu"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon color="white">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text" v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item router exact v-if="isAuthenticated" @click="logout">
          <v-list-item-action>
            <v-icon color="white">mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text"
              >Cerrar sesión</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="navbar" color="primary" clipped-left fixed app>
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer" />
      <a href="/">
        <img
          class="navbar__logo ml-5"
          src="@/assets/images/logo_blanco.svg"
          alt=""
        />
      </a>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      menu: [],
      guest: [
        {
          icon: 'mdi-account',
          title: 'Login',
          to: '/login',
        },
      ],
      admin: [
        {
          icon: 'mdi-account-multiple',
          title: 'Usuarios',
          to: '/usuarios',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn
    },
  },
  watch: {
    isAuthenticated() {
      this.selectMenu()
    },
  },
  created() {
    this.$vuetify.theme.dark = JSON.parse(
      localStorage.getItem('$vuetify.theme.dark')
    )
    this.selectMenu()
  },
  methods: {
    selectMenu() {
      if (this.$auth.loggedIn) {
        switch (this.$auth.user.userType.name) {
          case 'Administrador':
            this.menu = this.admin
            break
          default:
            this.menu = this.guest
        }
      } else {
        this.menu = this.guest
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('myauth/logout')
        await this.$auth.logout()
      } catch (error) {
        console.log(error.response)
        if (error.response.data.code)
          this.$toast.error(error.response.data.message)
        else this.$toast.error('No fue posible guardar la información')
      }
    },
    changeVista(vista) {
      this.$store.commit('setVista', vista)
    },
    ir(url) {
      this.$router.push(url)
    },
  },
}
</script>
<style lang="scss" scoped>
.link {
  cursor: pointer;
  margin: 0 5px;
}
.navbar {
  &__logo {
    width: 150px;
    height: 135px;
  }
}
</style>
