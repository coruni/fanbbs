<template>
	<view>
		<z-paging ref="paging" @query="getMessages" v-model="messages" use-chat-record-mode
			auto-hide-keyboard-when-chat>
			<template #top>
				<u-navbar placeholder autoBack :title="nickname"></u-navbar>
			</template>
			<view style="margin: 30rpx;">
				<block v-for="(item,index) in messages" :key="index">
					<u-row v-if="item.uid != userInfo.uid">
						<u-avatar :src="item.userJson.avatar"></u-avatar>
						<view style="background: #85a3ff32;padding:6rpx;margin-left: 10rpx;border-radius: 20rpx;">
							<text>{{item.text}}</text>
						</view>
					</u-row>
					<u-row v-if="item.uid == userInfo.uid" justify="end">
						<view style="background: #85a3ff32;padding:6rpx;margin-right: 10rpx;border-radius: 20rpx;">
							<text>{{item.text}}</text>
						</view>
						<u-avatar :src="item.userJson.avatar"></u-avatar>

					</u-row>
				</block>
			</view>
			<template #bottom>
				<view style="padding: 30rpx;">
					1312312
				</view>
			</template>
		</z-paging>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				nickname: null,
				id: 0,
				roomId: 1,
				messages: [],
			}
		},
		onLoad(params) {
			this.nickname = params.nickname
			this.getData(params.id)
			console.log(params)
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			getData(id) {
				this.$http.post('/typechoChat/getPrivateChat', {
					touid: this.id
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.roomId = res.data.data
					}
				})
			},
			getMessages(page, limit) {
				this.$http.post('/typechoChat/msgList', {
					page,
					limit,
					chatid: this.roomId
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			}
		}
	}
</script>

<style>

</style>