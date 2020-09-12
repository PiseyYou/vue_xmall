<template>
  <div id="app">
    <router-view class="main"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import 'assets/style/index';
#app {
  height: 100%;
}
.main {
  background: #ededed;
  overflow: hidden;
  width: 100%;
}
</style>
