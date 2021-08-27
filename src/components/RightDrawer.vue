<template>
  <v-navigation-drawer
      class="drawer"
      ref="drawer"
      mini-variant-width="60"
      permanent
      app
      right
      clipped
      :width="navigation.width"
      v-model="navigation.shown"
  >


  </v-navigation-drawer>
</template>

<script>
// import {mapActions} from "vuex";

export default {
  name: "RightDrawer",
  components: {},
  data: () => {
    return {
      navigation: {
        shown: false,
        width: 650,
        borderSize: 3,
        drawer: true,
      }
    };
  },
  computed: {
    direction() {
      return this.navigation.shown === false ? "Open" : "Closed";
    }
  },
  mounted() {
    this.setBorderWidth();
    this.setEvents();
    this.reObs = new ResizeObserver(this.onResize)
        .observe(this.$refs.drawer.$el)
    // router.push('kpi').catch(()=>{});

  },
  methods: {
    // ...mapActions(['SET_WINDOW_SIZE', ]),
    forceUpdateMe() {
      this.$forceUpdate();
    },
    onResize() {
      if (!this.$refs.drawer || !this.$refs.drawer.$el || typeof this.$refs.drawer.$el == 'undefined') {
        return;
      }
      // console.log(this.$refs.line.offsetHeight);
      // console.log(this.$refs.drawer.$el.offsetWidth);
      // this.SET_WINDOW_SIZE(this.$refs.drawer.$el.offsetWidth)

    },
    setBorderWidth() {
      let i = this.$refs.drawer.$el.querySelector(
          ".v-navigation-drawer__border"
      );
      i.style.width = this.navigation.borderSize + "px";
      i.style.cursor = "ew-resize";
    },
    setEvents() {
      const minSize = this.navigation.borderSize;
      const el = this.$refs.drawer.$el;
      const drawerBorder = el.querySelector(".v-navigation-drawer__border");
      const vm = this;
      const direction = el.classList.contains("v-navigation-drawer--right")
          ? "right"
          : "left";

      function resize(e) {
        document.body.style.cursor = "ew-resize";
        let f = direction === "right"
            ? document.body.scrollWidth - e.clientX
            : e.clientX;
        el.style.width = f + "px";
      }

      drawerBorder.addEventListener(
          "mousedown",
          function (e) {
            if (e.offsetX < minSize) {
              el.style.transition = 'initial';
              document.addEventListener("mousemove", resize, false);
            }
          },
          false
      );

      document.addEventListener(
          "mouseup",
          function () {
            el.style.transition = '';
            vm.navigation.width = el.style.width;
            document.body.style.cursor = "";
            document.removeEventListener("mousemove", resize, false);
          },
          false
      );
    }
  },
  destroyed() {

  }
}
</script>

<style scoped>
.drawer {
  border-left: 5px solid;
  border-left-color: gray;

}
</style>