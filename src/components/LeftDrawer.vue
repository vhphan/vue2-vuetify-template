<template>

  <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      mini-variant-width="60"
      permanent
      :width="this.drawerWidth"
      :height="this.drawerHeight"
      clipped
      app

  >
    <v-list-item
        color="blue"
        dense
        class="ma-0 pa-0"
    >
      <v-list-item-avatar class="mx-3">
        <v-icon
            size="2rem"
            @click="mini=!mini"
        >fas fa-bars
        </v-icon>
      </v-list-item-avatar>

      <v-list-item-title
      >Side Bar Menu
      </v-list-item-title>

      <v-btn
          icon
          @click.stop="mini = !mini"
      >
        <v-icon>fas fa-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <v-card
        flat
        class="ma-0 pa-0 "
    >
      <v-tabs
          centered
          vertical
          dense
          class="ma-0 pa-0"
          height="23rem"
      >
        <v-tab class="ma-0">
          <v-icon left class="ma-0 pa-0">
            fas fa-copyright
          </v-icon>
        </v-tab>

        <v-tab class="ma-0">
          <v-icon left class="ma-0 pa-0">
            fas fa-info
          </v-icon>
        </v-tab>



        <v-tab-item v-if="!mini">
          <v-card
              flat
          >
            <div class="d-block mt-1 pa-2 blue accent-4 white--text">
              <h3>About 1</h3>
            </div>
          </v-card>
          <div>1</div>
        </v-tab-item>

        <v-tab-item v-if="!mini">
          <v-card
              flat
          >
            <div class="d-block mt-1 pa-2 blue accent-4 white--text">
              <h3>About 2</h3>
            </div>
          </v-card>
          <div>2</div>
        </v-tab-item>

      </v-tabs>

    </v-card>

  </v-navigation-drawer>

</template>
<script>


export default {
  components: {

  },
  name: "LeftDrawer",
  props: {
    drawerWidth: {type: Number, default: 380, required: false},
    drawerHeight: {type: String, default: '100%', required: false}
  },
  data() {
    return {
      drawer: true,
      mini: true,
      testColor: '#0000FF',
    }
  },
  methods: {
  },
  computed: {}
}
</script>

<style scoped>
/*.v-tabs--vertical > .v-tabs-bar {*/
/*  flex: 1 0 auto;*/
/*  height: auto;*/
/*  !*width: 70px;*!*/
/*}*/
.v-navigation-drawer {
  overflow: hidden;
}

.v-list-item__title {
  font-size: 22px;
}

.v-tab {
  min-width: 45px;
  border: solid 0.02rem #eae9e9;
}

</style>