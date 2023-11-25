<template>
	<view>
		<z-paging @query="getData" v-model="messages" ref="paging">
			<template #top>
				<u-navbar placeholder title="消息通知">
					<view slot="left"></view>
				</u-navbar>
			</template>
			<view style="margin: 30rpx;">
				<uv-scroll-list></uv-scroll-list>
			</view>
			<view style="margin: 30rpx;">
				<block v-for="(item, index) in messages" :key="index">
					<u-row align="top" @click="goPrivate(item)">
						<u-avatar :src="item.userJson.avatar"></u-avatar>
						<u-row style="flex-direction: column;margin-left: 20rpx;flex: 1;" align="top">
							<text>{{item.userJson.name}}</text>
							<u-row justify="space-between" style="flex:1;width: 100%;font-size: 26rpx;">
								<text class="u-line-1">{{item.lastMsg}}</text>
								<text style="font-size: 26rpx;flex-shrink: 0;"
									v-if="item.lastMsg">{{item.lastTime}}</text>
							</u-row>
						</u-row>
					</u-row>
				</block>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messages: [],
				rooms: [],
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.post('/typechoChat/myChat', {
					page,
					limit,

				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},
			getRoom(page, limit) {
				this.$http.post('/typechoChat/allChat', {
					type: 1,
					order: 'lastTime desc'
				}).then(res => {
					console.log(res)
				})
			},
			goPrivate(data) {
				this.$Router.push({
					path: '/pages/notice/private',
					query: {
						id: data.toid,
						nickname: data.userJson.name
					}
				})
			},
			goRoom(id) {

			}
		}
	}
</script>

<style>
</style>