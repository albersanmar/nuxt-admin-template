<template>
  <div class="divMain d-flex flex-column justify-center align-center">
    <div
      class="divMain__divRight d-flex flex-column justify-center align-center"
    >
      <forms-auth-login />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {},
  middleware: 'guess'
}
</script>
<style lang="scss" scoped>
.divMain {
  height: 100vh;
  &__divLeft {
    background: #001b59;
    @include screen(desktop) {
      width: 50vw;
    }
  }
  &__divRight {
    @include screen(desktop) {
      width: 50vw;
    }
  }
}
</style>
