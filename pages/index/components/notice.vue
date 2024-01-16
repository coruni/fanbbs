<template>
	<view>
		<z-paging @query="getData" v-model="messages" ref="paging" @onRefresh="onRefresh" :auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false">
			<template #top>
				<u-navbar placeholder title="消息通知" autoBack>
					<view slot="left">
						<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
				
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
						<u-avatar :src="item.userInfo.avatar"></u-avatar>
						<u-row style="flex-direction: column;margin-left: 20rpx;flex: 1;" align="top">
							<text>{{item.userInfo.screenName?item.userInfo.screenName:item.userInfo.name}}</text>
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
		data() {
			return {
				messages: [],
				rooms: [],
				noticeNum: {}
			}
		},
		created() {
			if (this.$store.state.hasLogin) {
			}
			uni.$on('login', data => {
				this.$refs.paging.reload()
			})
			this.getNoticeNum()
		},
		methods: {
			getData(page, limit) {
				if (!this.$store.state.hasLogin) return;
				this.$http.get('/chat/chatList', {
					params: {
						page,
						limit,
					}
				}).then(res => {
					if (res.data.code==200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			goPrivate(data) {
				this.$Router.push({
					path: '/pages/notice/private',
					query: {
						id: data.userInfo.uid,
						nickname: data.userInfo.screenName?data.userInfo.screenName:data.userInfo.name
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
				this.$http.get('/user/noticeNum', {
				}).then(res => {
					if (res.data.code==200) {
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