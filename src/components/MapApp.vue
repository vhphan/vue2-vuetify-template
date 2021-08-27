<template>
  <v-main>
    <v-row class="pa-0 ma-0" style="height:100%;">
      <v-col id="mapContainer" ref="mapContainer">
      </v-col>
    </v-row>
    <v-btn
        v-if="rightPaneShow"
        color="red"
        dark
        fixed
        right
        fab
        style="top: 10px; z-index:2000;"
        @click="toggleRightPane()"
    >
      <v-icon>fas fa-window-close</v-icon>
    </v-btn>

    <transition
        name="slide-fade"
    >
      <div v-if="rightPaneShow">
        <right-drawer
        />
      </div>

    </transition>

    <v-fab-transition>
      <v-btn

          v-if="!rightPaneShow"
          color="blue"
          dark
          fixed
          right
          fab
          style="top: 10px; right:10px; z-index:2000;"
          @click="toggleRightPane()"
      >
        <v-icon>fas fa-chart-bar</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-spacer
        class="mb-6"
    ></v-spacer>
  </v-main>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.control.layers.tree';
import 'leaflet.control.layers.tree/L.Control.Layers.Tree.css';
import 'leaflet-search';
import 'leaflet-search/dist/leaflet-search.min.css';
import 'leaflet-ajax';
import 'leaflet.gridlayer.googlemutant';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import {mapActions, mapGetters, mapState} from 'vuex';
import RightDrawer from "@/components/RightDrawer";
import mapFunctions from "@/utilities/mapFunctions";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: 'MapApp',
  components: {
    RightDrawer,
  },
  data() {
    return {
      invalidateTimer: 200,
      reObs: null,
      mapObj: {
        id: 'mapContainer',
        map: null,
        lControl: null,
        ctlTree: null,
        layerGroups: {},
        myFeatureGroup: [],
        searchControl: null,
        chloropleth: null,
        choloroplethInfo: {},
        legend: null
      },
      layers: [],
      sideBar: null,
      mapIsLoaded: false,
      replaceOverlays: false,
      polygonLayer: null,
      rightPaneShow: false,
      rightPaneShowDelay: false,
      layerMasterGroup: null,
      timingAdvanceGroup: null,
      pieLayer: null,
      searchMarker: null,
      baseMaps: null,
      heatmaps: {},
      markerMaps: {},
      heat: null,
      markersMap: null,
      pointsMap: null,
      ranking: 1,
      datePickerMenu: false,
    };
  },
  computed: {
    map: {
      get() {
        return this.mapObj.map;
      },
      set(newValue) {
        this.mapObj = {...this.mapObj, map: newValue};
      }
    },
    lControl: {
      get() {
        return this.mapObj.lControl;
      },
      set(newValue) {
        this.mapObj = {...this.mapObj, lControl: newValue};
      }
    },
    ctlTree: {
      get() {
        return this.mapObj.ctlTree;
      },
      set(newValue) {
        this.mapObj = {...this.mapObj, ctlTree: newValue};
      }
    },
    layerGroups: {
      get() {
        return this.mapObj.layerGroups;
      },
      set(newValue) {
        this.mapObj = {...this.mapObj, layerGroups: newValue};
      }
    },
    myFeatureGroup: {
      get() {
        return this.mapObj.myFeatureGroup;
      },
      set(newValue) {
        this.mapObj = {...this.mapObj, myFeatureGroup: newValue};
      }
    },
    searchControl: {
      get() {
        return this.mapObj.searchControl;
      },
      set(newValue) {
        this.mapObj.searchControl = newValue;
      }
    },
    ...mapState(
        {
          mapSettings: state => state.mapStore.mapSettings,
        },
    ),
    ...mapGetters(['center']),


  },
  methods: {
    ...mapActions(['showError', 'setLoading',]),
    clearMarker: function () {
      try {
        if (this.searchMarker) {
          this.map.removeLayer(this.searchMarker);
          this.searchMarker = null;
        }
      } catch (err) {
        console.log(err);
      }

    },
    toggleRightPane() {
      this.rightPaneShow = !this.rightPaneShow;
      // if (!this.rightPaneShow) {
      // }
      this.mapResize();
      if (this.rightPaneShow) {
        setTimeout(() => {
          this.rightPaneShowDelay = !this.rightPaneShowDelay;
        }, 1000)
      } else {
        this.rightPaneShowDelay = !this.rightPaneShowDelay;
      }
    },
    mapResize() {
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize({animate: true});
        }
      }, this.invalidateTimer)
    },
    changeLayerColor(layer, color, opacity = 0.2) {
      layer.eachLayer(function (l) {
        l.setStyle({
          color: color,
          fillColor: color,
          fillOpacity: opacity
        });
      });
    },
    changeLayerOpacity(layer, opacity) {
      layer.eachLayer(function (l) {
        l.setStyle({
          fillOpacity: opacity
        });
      });
    },
    makeMarkerMap({
                    data,
                    config = {
                      latitudeColumnName: 'latitude',
                      longitudeColumnName: 'longitude',
                      layerName: 'marker'
                    },
                  }) {
      const latCol = config.latitudeColumnName;
      const lngCol = config.longitudeColumnName;
      const layerName = config.layerName;
      const parsedData = data.map((d) => {
        return {latLng: [parseFloat(d[latCol]), parseFloat(d[lngCol])], info: d};
      })
      const filteredData = parsedData.filter(function (d) {
        return !isNaN(d['latLng'][0]) && !isNaN(d['latLng'][1]);
      });
      if (this.markerMaps[layerName] && this.map.hasLayer(this.markerMaps[layerName])) {
        this.map.removeLayer(this.markerMaps[layerName]);
      }
      let markers = [];
      filteredData.forEach((d) => {
        markers.push(new L.marker(d['latLng'])
            .bindPopup(function () {
              let output = [];
              let data = d['info'];
              for (let k in data) {
                output.push(`<tr><td style="border: solid 1px gray">${k}</td><td style="border: solid 1px gray">${data[k]}</td></tr>`);
              }
              return '<table style="border: solid 1px gray">' + output.join('') + '</table>';
            }, {
              maxHeight: '200',
              maxWidth: '500'
            }),
        );
      })
      this.markerMaps[layerName] = L.layerGroup(
          markers
      );
      this.markerMaps[layerName].addTo(this.map);
    },
    removeMarkerMap() {
      const context = this;
      Object.entries(context.markerMaps).forEach((k, v) => {
        context.map.removeLayer(v);
      })
    },
    resetMapObj: function (removeMap = true) {
      console.log('resetting mapObj');
      this.mapObj.lControl = null;
      this.mapObj.ctlTree = null;
      this.mapObj.layerGroups = null;
      this.mapObj.myFeatureGroup = null;
      this.mapObj.searchControl = null;
      this.mapObj.chloropleth = null;
      this.mapObj.choloroplethInfo = null;
      this.mapObj.legend = null

      if (removeMap && this.mapObj.map && this.mapObj.map.remove) {
        this.mapObj.map.off();
        this.mapObj.map.remove();
        console.log('removing map');
        this.mapObj.map = null;
      }

      this.mapObj = {
        ...this.mapObj,
        ...{
          id: 'mapContainer',
          lControl: null,
          ctlTree: null,
          layerGroups: {},
          myFeatureGroup: [],
          searchControl: null,
          chloropleth: null,
          choloroplethInfo: {},
          legend: null
        }
      }
    }
  },
  watch: {},
  mounted: function () {
    this.reObs = new ResizeObserver(this.mapResize)
        .observe(this.$refs.mapContainer);

    if (!this.mapObj.map && !this.mapIsLoaded) {
      console.log(this.mapObj.map);
      console.log(this.mapIsLoaded);
      console.log('setting up Leaflet map....');
      mapFunctions.setupLeafletMap(
          this.mapObj,
          'Positron (CartoDB)',
          this.center);
      this.mapIsLoaded = true;
    }
    window.onbeforeunload = () => {
      console.log('onbeforeunload');
      this.resetMapObj();
    }
  },
  beforeDestroy: function () {
    this.resetMapObj();

  },
  async created() {
    this.setLoading(true);
    this.setLoading(false);
  },
};
</script>

<style>

/*.leaflet-bar.easy-button-container.leaflet-control {*/
/*  margin-right: 10px;*/
/*}*/

#container {
  height: 100%;
  width: 100%;
}

#mapContainer {
  /*width: 100%;*/
  height: 95vh;
}


.v-navigation-drawer {
  z-index: 1001;
}

.v-btn--fab {
  z-index: 5002;
}

.leaflet-control-container .leaflet-top.leaflet-left {
  position: absolute;
  left: auto;
  right: 10px;
}

.leaflet-verticalcenter {
  position: absolute;
  z-index: 500;
  pointer-events: none;
  top: 20%; /* possible because the placeholder's parent is the map */
  transform: translateY(-50%); /* using the CSS3 Transform technique */
  padding-top: 5px;
}

.leaflet-verticalcenter .leaflet-control {
  margin-bottom: 50%;
}

.slide-fade-enter-active {
  transition: all 1s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */
{
  transform: translateY(30px);
  opacity: 0;
}

.map2Open {
  height: 100%;
}

.map2Close {
  height: 0;
}


.legend {
  line-height: 18px;
  color: #555;
  background-color: white;
  width: 120px;
}

.legend i {
  width: 15px;
  height: 12px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}

.info-pane {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.info-pane h4 {
  margin: 0 0 5px;
  color: #777;
}

</style>