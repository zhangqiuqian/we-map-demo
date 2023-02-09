<template>
  <div id="container"></div>
</template>

<script>
  import TMap from 'TMap'
  import { toGCJ02, toWGS84 } from '@/utils/coor'
  export default {
    name: 'tx-map',
    data() {
      return {
        center: [111.06575713601103, 35.09260704247744],
        map: null,
        WeatherSimulator: null,
        lightSimulator: null,
        tileset3D: null
      }
    },
    methods: {
      init() {
        let center = toGCJ02(this.center)

        // 初始化地图
        this.map = new TMap.Map('container', {
          zoom: 16,
          pitch: 65,
          mapStyleId: 'style2',
          center: new TMap.LatLng(center[1], center[0]),
          baseMap: {
            type: 'vector',
            features: ['base', 'building3d', 'building2d', 'arrow', 'tree'],
            buildingRange: [15, 20]
          }
        })

        // 控件位置
        var controlZoom = this.map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM)
        controlZoom.setPosition(TMap.constants.CONTROL_POSITION.CENTER_RIGHT)
        var controlRotation = this.map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)
        controlRotation.setPosition(TMap.constants.CONTROL_POSITION.CENTER_RIGHT)

        //高精道路
        new TMap.model.HDRoadModel({
          id: '510112',
          map: this.map,
          styleId: 'DEFAULT'
        })

        this.map.on('click', function (evt) {
          var lat = evt.latLng.getLat()
          var lng = evt.latLng.getLng()
          var point = toWGS84([lng, lat])
          console.log(point)
        })

        // 初始化天气仿真器
        // this.weatherSimulator = new TMap.simulation.WeatherSimulator(this.map)
        // this.changeWeater('rain')

        // 初始化光照模拟器
        // this.lightSimulator = new TMap.simulation.LightSimulator(this.map)
        // this.changeLight(new Date())

        // this.loadModel()

        this.load3DTiles()
      },
      changeWeater(val) {
        console.log(val)
        if (val === 'snow' || val === 'rain') {
          this.weatherSimulator.setWeather({
            type: val
          })
        } else if (val === 'fog') {
          this.weatherSimulator.setWeather({
            type: val,
            level: TMap.simulation.constants.FOG_LEVEL.FOG //雾等级，支持轻雾、大雾、浓雾、强浓雾、特强浓雾五个等级
          })
        } else {
          this.weatherSimulator.setWeather({
            type: val,
            level: 1 //阴天程度，范围0-1，0对应晴天，1对应黑天
          })
        }
      },
      changeLight(date) {
        this.lightSimulator.setLight({
          date
        })
      },
      loadModel() {
        let location = toGCJ02([112.884302474301, 28.120756218903])
        let masks = [toGCJ02([112.88257740742075, 28.120690804141216]), toGCJ02([112.8839844456183, 28.122287553598316]), toGCJ02([112.88610886354657, 28.120670990894425]), toGCJ02([112.8845943679777, 28.119213913969194])]
        new TMap.model.GLTFModel({
          url: '/models/lukou.glb', //模型路径
          map: this.map,
          position: new TMap.LatLng(location[1], location[0], 1), //放置位置，
          scale: [5, 5, 5], //模型在XYZ三轴上的缩放比例,
          mask: masks.map(v => new TMap.LatLng(v[1], v[0]))
        })
      },
      load3DTiles() {
        this.tileset3D = new TMap.model.Tileset3D({
          url: 'https://mapapi.qq.com/web/lbs/visualizationApi/demo/data/3dTilesGCJ02/tileset.json',
          map: this.map,
          offset: [0, 0, -372],
          mask: [new TMap.LatLng(35.09043722089289, 111.07136274422078), new TMap.LatLng(35.09037943278917, 111.06080724240826), new TMap.LatLng(35.10124876283047, 111.06080603927808), new TMap.LatLng(35.10125914410558, 111.07145236890074)]
        })
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #container {
    width: 100%;
    height: 100%;
  }
</style>
