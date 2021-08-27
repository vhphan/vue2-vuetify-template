<template>
  <!--  <div id="app">-->
  <!--    <div id="nav">-->
  <!--      <router-link to="/">Home</router-link> |-->
  <!--      <router-link to="/about">About</router-link>-->
  <!--    </div>-->
  <!--    <router-view/>-->
  <!--  </div>-->
  <v-app id="app" style="height:100vh;">
    <v-app-bar
        app
        dark
        dense id="app-bar"
        style="z-index:1002;"
        clipped-left
        clipped-right
    >
      <v-app-bar-title class="mr-5">
      </v-app-bar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-list-item v-for="item in menuItems" :key="item.text">
          <v-btn text :to="item.to">{{ item.text }}</v-btn>
        </v-list-item>


      </v-toolbar-items>
      <v-progress-circular
          indeterminate
          color="blue"
          size="80"
          width="10"
          v-show="loading"
      />
      <v-spacer/>
      <v-list nav dense class="pa-0 ma-0">
        <v-list-item>
          &copy; Phan , version: {{ version }}
        </v-list-item>
      </v-list>
      <v-list nav dense class="pa-0 ma-0">
        <v-list-item>
          build: {{ buildTimestampUTC }}
        </v-list-item>
      </v-list>

    </v-app-bar>
    <v-snackbar
        v-model="alert"
        :bottom="true"
        color="red"
        :multi-line="true"
        :top="true"
        :vertical="true"
        :timeout="snackbarTimeout"
    >
      {{ $store.state.error.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="toggleError"
        >
          Close
        </v-btn>
      </template>

    </v-snackbar>
    <keep-alive include="MapView">
      <router-view/>
    </keep-alive>
    <v-snackbar
        v-model="snackbar"
        :timeout="snackbarTimeout"
        color="#345eeb"
        elevation="24"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>
<script>
import {mapActions, mapGetters, mapState} from "vuex";


export default {
  name: 'App',
  data() {
    return {
      menuItems: [
        {to: '/', text: 'Map'},
        {to: '/about', text: 'About'},
      ],
      snackbar: false,
      snackbarText: '',
      snackbarTimeout: 5000,
      spinner: false,
      snackbarDefaultTimeout: 5000,
    }
  },
  components: {},
  beforeDestroy() {
  },
  mounted() {

  },
  async created() {
    const context = this;
    setTimeout(function () {
      // showSnackbar('Welcome');
    }, 100);
    setTimeout(function () {
      if (['Map'].includes(context.$route.name)) {
        // showSnackbar('Please wait for maps to load before you do anything...', 8000)
      }
    }, 1500);
  },
  methods: {
    ...mapActions(['toggleError', 'showError', 'setLoading',]),
  },
  computed: {
    ...mapGetters(['buildTimestampUTC']),
    alert: {
      get() {
        return this.$store.state.error.show
      },
      set(v) {
        if (!v) {
          this.toggleError();
        }
      }
    },
    ...mapState(
        {
          'loading': state => state.generalStore.loading,
          'version': state => state.version,
        }
    )
  },
  async beforeCreate() {
    await this.$store.commit('initialiseStore');
  },


}
</script>


<style>
body {
  margin: 0;
  padding: 0;
}

.v-menu__content.v-menu__content--fixed.menuable__content__active {
  z-index: 500 !important;
}

</style>
