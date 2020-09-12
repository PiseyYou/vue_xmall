<template>
  <div>
    <!-- <h3>导航</h3> -->
    <m-header></m-header>
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from '../common/MHeader'
export default {
  components: {
    MHeader
  }
}
</script>

<style lang="scss" scoped></style>
