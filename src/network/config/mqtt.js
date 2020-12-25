import Stomp from "stompjs";
//  const MQTT_SERVICE = 'ws://127.0.0.1:15674/ws'  // mqtt服务地址
//   const MQTT_USERNAME = 'guest' // mqtt连接用户名
//  const MQTT_PASSWORD = 'guest' // mqtt连接密码
const MQTT_SERVICE = 'ws://111.75.252.147:15674/ws'
const MQTT_USERNAME = 'admin' // mqtt连接用户名
const MQTT_PASSWORD = 'admin' // mqtt连接密码
export const client = Stomp.client(MQTT_SERVICE)

function success() {
	console.log('连接成功')
}

function failed(err) {
	console.log('连接失败')
	console.log(err);
}
client.debug = null
export function connect() {
	//初始化mqtt客户端，并连接mqtt服务
	const headers = {
		login: MQTT_USERNAME,
		passcode: MQTT_PASSWORD
	};
	client.connect(headers, success, failed /* , this.onConnected, this.onFailed */ );
}

export function disconnect() {
	client.disconnect(() => {
		console.log("连接已断开");
	}, {})
}

// onConnected(frame) {
//   //订阅频道
//     const topic = "/exchange/BaseDataExchange/routeData.alarm.65";
//     client.subscribe(topic, this.responseCallback, this.onFailed);
//   },
//   onFailed(frame) {
//     console.log("MQ Failed: " + frame);
//   },
//   responseCallback(frame) {
//     console.log("MQ msg=>" + frame.body);
//     //接收消息处理
//   },