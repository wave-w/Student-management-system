<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
  import {
    connect,
    client
  } from './network/config/mqtt';
   import {
        logout
    } from '@/network/login';
  export default {
    created() {
      // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
      connect()
      // setTimeout(() => {
      //   if (!client.connected) {
      //     this.$router.go(0)
      //   }
      // }, 500)
      let aconntime = setInterval(() => {
        if (!client.connected) {
          connect()
        }
      }, 2000);
      setTimeout(() => {
        if(client.connected){
         clearInterval(aconntime)
      }
      }, 5000);
      setTimeout(() => {
          clearInterval(aconntime)
      }, 10000);
    },
destroyed() {
  logout().then()
},
  }
</script>
<style>
</style>
