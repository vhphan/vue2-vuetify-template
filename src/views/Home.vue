<template>
  <div class="home">
    <left-drawer/>
    <map-app/>
  </div>
</template>

<script>
// @ is an alias to /src
import LeftDrawer from "@/components/LeftDrawer";
import MapApp from "@/components/MapApp";

export default {
  name: 'Home',
  components: {
    MapApp,
    LeftDrawer,

  }
}
</script>

<style scoped>
.home {
  position:relative;
  height: 100vh;
}
</style>
