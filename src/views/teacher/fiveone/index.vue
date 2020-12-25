<template>
  <div>
  <button @click="revesive">接受老师
  </button>

  </div>
</template>

<script>
import { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD,client,connect } from "@/network/config/mqtt";
export default {
 data() {
		return {
		msgs:''
    	};
  	},
  	created() {
		connect();
	},
	methods: {
      revesive(){
       client.subscribe('test',msg=>{
		  console.log(JSON.parse(msg.body));
		  this.msgs = msg.data
        },{})
      }
	}
}
</script>

<style  scoped>
</style>