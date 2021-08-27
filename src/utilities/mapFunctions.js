import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet.control.layers.tree';
import 'leaflet.control.layers.tree/L.Control.Layers.Tree.css';
import 'leaflet-search';
import 'leaflet-search/dist/leaflet-search.min.css';
import 'leaflet-ajax';
import 'leaflet.gridlayer.googlemutant';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import 'leaflet.sync';
import store from '../store';

let colormap = require('colormap')

function loadScript(url, callback) {

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

export default {

    addControlPlaceholders(map) {
        var corners = map._controlCorners,
            l = 'leaflet-',
            container = map._controlContainer;

        function createCorner(vSide, hSide) {
            var className = l + vSide + ' ' + l + hSide;
            corners[vSide + hSide] = L.DomUtil.create('div', className, container);
        }

        createCorner('verticalcenter', 'left');
        createCorner('verticalcenter', 'right');
        return map;
    },
    setUpBasemaps: function () {
        const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18
        });
        const osmMonochrome = L.tileLayer('http://a.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18
        });

        const cartodb_light = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
            maxZoom: 18
        });
        const cartodb_dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
            maxZoom: 18
        });
        const openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
        const Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
            attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });
        const Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
            attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });
        const Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="https://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 1,
            maxZoom: 16,
            ext: 'jpg'
        });
        const Waze = L.tileLayer('https://worldtiles3.waze.com/tiles/{z}/{x}/{y}.{ext}', {
            attribution: 'Map tiles by <a href="https://waze.com">Waze</a>, <a href=""></a> &mdash; Map data &copy; <a href="">Waze</a>',
            subdomains: 'abcd',
            minZoom: 1,
            maxZoom: 16,
            ext: 'png'
        });

        const googleMap = L.gridLayer.googleMutant({
            type: 'terrain' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        });

        const googleMapSatellite = L.gridLayer.googleMutant({
            type: 'satellite' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        });
        const googleHybrid = L.gridLayer.googleMutant({
            type: 'hybrid' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        });
        const googleRoadmap = L.gridLayer.googleMutant({
            type: 'roadmap' // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        });

        return {
            'Positron (CartoDB)': cartodb_light,
            'Dark Matter (CartoDB)': cartodb_dark,
            'OSM Default': osm,
            'OSM Monochrome': osmMonochrome,
            'Open Topo': openTopo,
            'Stamen Watercolor': Stamen_Watercolor,
            'Stamen Toner': Stamen_TonerBackground,
            'Stamen Toner Lite': Stamen_TonerLite,
            'Google': googleMap,
            'Google Satellite': googleMapSatellite,
            'Google Hybrid': googleHybrid,
            'Google Roadmap': googleRoadmap,
            'Waze': Waze,
        };
    },
    popUpAjax: function (feature, layer, url) {
        console.log(feature, layer, url);

    },
    setPopUp: function (data, layer, context) {
        let output = [];
        for (let k in data) {
            output.push(`<tr><td style="border: solid 1px gray">${k}</td><td style="border: solid 1px gray">${data[k]}</td></tr>`);
        }
        let finalTable = '<table style="border: solid 1px #ce7315;">' + output.join('') + '</table>';
        layer.bindPopup(finalTable,
            {
                maxHeight: '200',
                maxWidth: '300'
            });
        if (context.mapSettings.popUpInfo) {
            layer.openPopup();
        }

    },
    getClickedFeatureInfo: function (feature, layer, context) {
        const me = this;
        // let clickedFeatureInfo;
        layer.on('click', async function (e) {
            if (e.target.feature.properties['Cell Name']) {
                context.selectedCell = e.target.feature.properties['Cell Name'];
                context.selectedLocationID = e.target.feature.properties['LocationID'];
                me.colorCell(e.target);
                const cellInfo = await store.dispatch('GET_CELL_INFO', context.selectedCell);
                context.selectedCellTech = cellInfo['Technology'];
                context.selectedSiteID = cellInfo['SiteID'];
                store.dispatch('SET_CLICKED_DATA', cellInfo);
                if (context.drawTA) {
                    await context.drawTimingAdvance();
                }
            } else {
                store.dispatch('SET_CLICKED_DATA', e.target.feature.properties);
            }
        });
    },
    popUp: function (feature, layer, context) {
        const me = this;
        layer.on('click', async function (e) {
            if (e.target.feature.properties['Cell Name']) {
                context.selectedCell = e.target.feature.properties['Cell Name'];
                context.selectedLocationID = e.target.feature.properties['LocationID'];
                me.colorCell(e.target);
                const cellInfo = await store.dispatch('GET_CELL_INFO', context.selectedCell);
                // if (context.drawTA) {
                //     await context.drawTimingAdvance();
                // }
                context.selectedCellTech = cellInfo['Technology'];
                context.selectedSiteID = cellInfo['SiteID'];
                me.setPopUp(cellInfo, layer, context);
                console.log('setPopUp complete');
                layer.on('popupclose', function () {
                    store.dispatch('SET_POPUP_INFO', null).then(() => {
                    });
                })
            } else {
                me.setPopUp(e.target.feature.properties, layer, context);
                console.log('setPopUp complete');
            }
        });
    },
    addRulerToMap: function (map) {
        const ruler = L.control.ruler();
        ruler.addTo(map);
        ruler.setPosition('bottomright');
    },
    changeLayerColor(layer, color) {
        layer.eachLayer(function (l) {
            l.setStyle({
                color: color,
                fillColor: color,
                fillOpacity: 0.2
            });
        });
    },
    setupLeafletMap: function (mapObj, tileName = 'Dark Matter (CartoDB)', center, addRuler = true, zoom = 14) {
        const me = this;
        let baseMaps = this.setUpBasemaps();
        console.log(center, zoom);
        mapObj.map = L.map(mapObj.id, {
            layers: baseMaps[tileName],
            center: center,
            zoom: zoom,
            preferCanvas: true,
        });


        mapObj.map = this.addControlPlaceholders(mapObj.map);
        mapObj.map.attributionControl.setPrefix('');
        let baseTreeChildren = [];
        Object.keys(baseMaps).forEach(function (key) {
            baseTreeChildren.push({label: key, layer: baseMaps[key]});
        });

        let baseTree = {
            label: 'BaseLayers',
            noShow: true,
            children: [{
                label: 'Base Maps',
                children: baseTreeChildren
            }],
        };

        mapObj.ctlTree = L.control.layers.tree(baseTree, null,
            {
                namedToggle: false,
                collapsed: true,
                position: 'bottomright',
            });
        if (addRuler) {
            if (L.control.ruler) {
                me.addRulerToMap(mapObj.map);
            } else {
                loadScript("https://cdn.rawgit.com/gokertanrisever/leaflet-ruler/master/src/leaflet-ruler.js", function () {
                    me.addRulerToMap(mapObj.map)
                })
            }
        }

        mapObj.ctlTree.addTo(mapObj.map).collapseTree();
        mapObj.lControl = L.control.layers(this.baseMaps);
        mapObj.map.zoomControl.setPosition('bottomright');

    },
    colorCell(layer, color = '#43ef04', timeout = 8000) {
        const context = this;
        try {
            if (layer.feature !== undefined) {
                if (layer.feature.properties['Cell Name']) {
                    let origStyle = layer.options.style;
                    layer._origStyle = origStyle;
                    layer.setStyle({fillColor: color, fillOpacity: 0.9});
                    setTimeout(function () {
                        // layer.setStyle({ color: '#000', weight: 1 });
                        layer.setStyle(origStyle);
                    }, timeout);
                } else if (layer._origStyle !== undefined) {
                    layer.setStyle(layer._origStyle);
                }
            }
        } catch (err) {
            console.log(err.message);
            context.showError(err);
        }

    },
    getColor(value) {
        const d = value / 1000
        let colors = colormap({
            colormap: 'RdBu',
            nshades: 8,
            format: 'hex',
            alpha: 1
        });
        colors.reverse();
        // console.log([
        //     "#b20a1c",
        //     "#cc4e3b",
        //     "#e6915a",
        //     "#dcaa84",
        //     "#94a4db",
        //     "#6a89f7",
        //     "#384ad2",
        //     "#050aac"])
        // return d > 70 ? '#800026' :
        //     d > 60 ? '#BD0026' :
        //         d > 50 ? '#E31A1C' :
        //             d > 40 ? '#FC4E2A' :
        //                 d > 30 ? '#FD8D3C' :
        //                     d > 20 ? '#FEB24C' :
        //                         d > 10 ? '#FED976' :
        //                             '#FFEDA0';
        return d > 70 ? colors[7] :
            d > 60 ? colors[6] :
                d > 50 ? colors[5] :
                    d > 40 ? colors[4] :
                        d > 30 ? colors[3] :
                            d > 20 ? colors[2] :
                                d > 10 ? colors[1] :
                                    colors[0];
    },
    removeChloropleth: function (mapObj) {
        if (mapObj.map.hasLayer(mapObj.chloropleth)) {
            mapObj.map.removeLayer(mapObj.chloropleth);
            mapObj.chloropleth = null;
        }
    },
    removePointsLayer: function (mapObj) {
        if (mapObj.map.hasLayer(mapObj.pointsMap)) {
            mapObj.map.removeLayer(mapObj.pointsMap);
            mapObj.pointsMap = null;
        }
    },
    drawChloropleth(context, mapObj, chloroData, colorFunction, colorProperty) {
        function style(feature) {
            return {
                fillColor: colorFunction(feature.properties[colorProperty]),
                weight: 0.5,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.5
            };
        }

        // function mouseOverHighlightFeature(e) {
        //     let layer = e.target;
        //     layer.setStyle({
        //         weight: 5,
        //         color: '#666',
        //         dashArray: '',
        //     });
        // }
        function mouseClickedHighlightFeature(e) {
            resetHighlight(e);
            let layer = e.target;
            layer.setStyle({
                weight: 5,
                color: '#f10808',
                dashArray: '',
            });
        }

        function resetHighlight() {
            mapObj.chloropleth.resetStyle();
        }

        // const popUp = this.popUp;

        function onEachFeature(feature, layer) {
            layer.on({
                // mouseover: mouseOverHighlightFeature,
                // mouseout: resetHighlight,
                click: mouseClickedHighlightFeature
            });
            // popUp(feature, layer, context);
        }

        mapObj.chloropleth = L.geoJson(chloroData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(mapObj.map).bringToBack();

    },
    drawPointsLayer(context, mapObj, pointsData, colorFunction, colorProperty) {
        this.removePointsLayer(mapObj);

        function style(feature) {
            return {
                fillColor: colorFunction(feature.properties[colorProperty]),
                weight: 1,
                opacity: 1,
                color: '#504a4a',
                fillOpacity: 0.8,
                radius: 5,

            };
        }

        const popUp = this.popUp;

        function onEachFeatureP(feature, layer) {
            popUp(feature, layer, context);
        }


        mapObj.pointsMap = L.geoJson(pointsData, {
            onEachFeature: onEachFeatureP,
            pointToLayer: function (feature, latlng) {
                const kbps = feature.properties['download_kbps'];
                let circleMarker = L.circleMarker(latlng, style(feature));
                circleMarker.bindTooltip(function () {
                    const color = colorFunction(feature.properties[colorProperty]);
                    return `<div style='background:${color};'><b>${(kbps / 1000).toFixed(1)} mbps</b></div>`;
                }, {
                    permanent: false,
                    opacity: 0.8,

                });
                return circleMarker;

            }
        }).addTo(mapObj.map).bringToFront();


    }


}
;