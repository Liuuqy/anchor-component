<template>
  <div id="app">
    <AnchorNav scrollDom="app" :anchorList="list"></AnchorNav>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" id="test1"/>
    <div id="test2" class="item2">
      占位2
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import AnchorNav from './components/Anchor.vue';
export default {
  name: 'App',
  components: {
    HelloWorld,
    AnchorNav
  },
  data(){
    return {
      list:[
        {
          label:'测试1',
          anchor:'test1'
        },
        {
          label:'测试2',
          anchor:'test2'
        }
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100vh;
  overflow: auto;
  .item2{
    padding: 50% 0;
    width: 90%;
    height: 300px;
    margin: 1px solid black;
    margin: 0 5%;
  }
}
</style>
