<template>
	<view>
		<z-paging @query="getData" v-model="messages" ref="paging" @onRefresh="onRefresh" :auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false">
			<template #top>
				<u-navbar placeholder title="消息通知">
					<view slot="left"></view>
				</u-navbar>
				<view style="margin: 30rpx;">
					<uv-scroll-list :indicator="false">
						<block v-for="(item,index) in rooms" :key="index">
							<u-avatar :src="item.pic"></u-avatar>
						</block>
					</uv-scroll-list>
				</view>
			</template>

			<view style="margin: 30rpx;">
				<u-row customStyle="margin-bottom:60rpx" justify="space-between" @click="goPath('finance')">
					<u-row>
						<view
							style="background: #8c68f8;border-radius: 500rpx;padding: 20rpx;box-shadow: 0 0 8px 0 #8c68f8;">
							<u-icon name="rmb-circle" size="24" color="white"></u-icon>
						</view>
						<text style="margin-left:20rpx">财务通知</text>
					</u-row>
					<i style="background: red;padding: 8rpx;border-radius: 10rpx;" v-if="$store.state.noticeNum.finances"></i>
				</u-row>
				<u-row customStyle="margin-bottom:60rpx" justify="space-between" @click="goPath('systems')">
					<u-row>
						<view
							style="background: #f8d568;border-radius: 500rpx;padding: 20rpx;box-shadow: 0 0 8px 0 #f8d568;">
							<u-icon name="bell" size="24" color="white"></u-icon>
						</view>
						<text style="margin-left:20rpx">系统通知</text>
					</u-row>
					<i style="background: red;padding: 8rpx;border-radius: 10rpx;" v-if="$store.state.noticeNum.systems"></i>
				</u-row>
				<u-row customStyle="margin-bottom:60rpx" justify="space-between" @click="goPath('comments')">
					<u-row>
						<view
							style="background: #68d4f8;border-radius: 500rpx;padding: 20rpx;box-shadow: 0 0 8px 0 #68d4f8;">
							<u-icon name="chat" size="24" color="white"></u-icon>
						</view>
						<text style="margin-left:20rpx">评论通知</text>
					</u-row>
					<i style="background: red;padding: 8rpx;border-radius: 10rpx;" v-if="$store.state.noticeNum.comments"></i>
				</u-row>

				<block v-for="(item, index) in messages" :key="index">
					<u-row align="top" @click="goPrivate(item)" customStyle="margin-bottom:20rpx">
						<u-avatar :src="item.userJson.avatar"></u-avatar>
						<u-row style="flex-direction: column;margin-left: 20rpx;flex: 1;" align="top">
							<text>{{item.userJson.name}}</text>
							<u-row justify="space-between" style="flex:1;width: 100%;font-size: 26rpx;">
								<text class="u-line-1">{{item.lastMsg && item.lastMsg.text}}</text>
								<text style="font-size: 26rpx;flex-shrink: 0;"
									v-if="item.lastMsg">{{$u.timeFrom(item.lastTime,'hh:MM')}}</text>
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
		props: {
			index: {
				type: [String, Number],
				default: 0
			}
		},
		watch: {
			index: {
				handler(e) {
					if (e == this.index) {
						this.getNoticeNum()
						this.$refs.paging.reload()
					}
				},
				immediate: false,
				deep: true
			}
		},
		data() {
			return {
				messages: [],
				rooms: [],
				noticeNum: {}
			}
		},
		created() {
			if (this.$store.state.hasLogin) {
				this.getRoom()
				this.getNoticeNum()
			}
			uni.$on('login', data => {
				this.$refs.paging.reload()
			})
		},
		methods: {
			getData(page, limit) {
				if (!this.$store.state.hasLogin) return;
				this.$http.get('/typechoChat/myChat', {
					params: {
						page,
						limit,
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}

				}).then(res => {
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},
			getRoom(page, limit) {
				this.$http.get('/typechoChat/allChat', {
					params: {
						type: 1,
						order: 'lastTime',
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}

				}).then(res => {
					
					if (res.data.code) {
						this.rooms = res.data.data
					}
				})
			},
			goPrivate(data) {
				console.log(data)
				this.$Router.push({
					path: '/pages/notice/private',
					query: {
						id: data.userJson.uid,
						nickname: data.userJson.name
					}
				})
			},
			onRefresh() {
				if (this.$store.state.hasLogin) {
					this.getNoticeNum()
				}
			},
			goRoom(id) {

			},
			getNoticeNum() {
				this.$http.get('/typechoUsers/unreadNum', {
					params: {
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}
				}).then(res => {
					if (res.data.code) {
						this.$store.commit('setNoticeNum',res.data.data)
					}
				})
			},
			goPath(path) {
				this.$Router.push({
					name: path
				})
			}
		}
	}
</script>

<style>
</style>