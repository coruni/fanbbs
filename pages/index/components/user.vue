<template>
	<view>
		<z-paging ref="paging" refresher-only @onRefresh="initData">
			<template #top>
				<u-navbar bgColor="transparent">
					<u-icon name="scan" slot="left" size="26" color="white"></u-icon>
					<u-icon name="list" slot="right" size="26" color="white" @click="showRightMenu = true"></u-icon>
				</u-navbar>
			</template>
			<view style="position: relative;top: 0;">
				<image :src="userInfo.userBg?userInfo.userBg:'/static/login.png'" mode="aspectFill"
					style="width: 100%; height: 800rpx;"></image>
				<view class="overlay"></view>
				<view style="position: absolute;top: 160rpx;margin: 30rpx;">
					<u-avatar :src="userInfo.avatar" size="70" customStyle="border:6rpx solid #fff"
						@click="$store.state.hasLogin?goProfile():goLogin()"></u-avatar>
					<!-- 已登录 -->
					<view style="margin-top: 20rpx;display: flex;flex-direction: column;" v-if="$store.state.hasLogin">
						<text style="color: white;font-weight: bold;">{{userInfo.screenName}}</text>
						<view style="font-size: 24rpx;color: #999;display: flex;flex-direction: column;">
							<text>UID: {{userInfo.uid}}</text>
							<text class="u-line-2">{{userInfo.introduce}}</text>
						</view>
						<view style="margin-top: 20rpx;">
							<u-row>
								<u-row
									customStyle="background:#00aaff4c;padding:8rpx 12rpx;color:white;border-radius:10rpx">
									<u-icon name="man" size="14" color="white"></u-icon>
									<text style="font-size: 24rpx;">男</text>
								</u-row>
								<u-row
									customStyle="margin-left:20rpx;background:#ffffff4c;padding:8rpx 12rpx;color:white;border-radius:10rpx">
									<u-icon name="map" size="12" color="white"></u-icon>
									<text style="font-size: 24rpx;">广东</text>
								</u-row>
							</u-row>
						</view>
						<view style="margin-top: 20rpx;">
							<u-row justify="space-between">
								<view style="color:#999">
									<text style="color: white;">{{userMeta.fanNum}}</text>
									<text style="font-size: 24rpx;margin-left: 5rpx;">粉丝</text>
								</view>
								<view style="color:#999;margin: 0 20rpx;">
									<text style="color: white;">{{userMeta.followNum}}</text>
									<text style="font-size: 24rpx;margin-left: 5rpx;">关注</text>
								</view>
								<view style="color:#999">
									<text style="color: white;">{{userMeta.contentsNum}}</text>
									<text style="font-size: 24rpx;margin-left: 5rpx;">帖子</text>
								</view>

							</u-row>
						</view>
					</view>
					<!-- 未登录占位 -->
					<view style="margin-top: 20rpx;display: flex;flex-direction: column;" v-else>
						<text style="color: white;font-weight: bold;" @click="goLogin">点击登录</text>
					</view>
				</view>
			</view>
			<view style="position: relative;top: -50rpx;background: #fff;border-radius: 40rpx 40rpx 0 0;">
				<view style="padding: 30rpx 30rpx 0 30rpx;">
					<u-scroll-list indicatorActiveColor="#fb7299" :indicator="false">
						<block v-for="(item,index) in scrollList" :key="index">
							<u-row justify="start" align="top"
								customStyle="flex-direction:column;margin-right:20rpx;background: #f4f4f4;border-radius: 20rpx;padding:20rpx">
								<u-row>
									<u-icon :name="item.icon"></u-icon>
									<text style="font-size: 28rpx;">{{item.name}}</text>
								</u-row>
								<text style="font-size: 22rpx;color: #999;">{{item.description}}</text>
							</u-row>
						</block>
					</u-scroll-list>
				</view>
				<view>
					<u-tabs :list="list" lineColor="#FB7299" activeStyle="color:#303133;font-weight:bold"
						:current="tabsIndex" inactiveStyle="color:#999" @change="tabsIndex = $event.index"></u-tabs>
					<swiper style="height: 100vh;" :current="tabsIndex" @animationfinish="tabsIndex = $event.detail.current">
						<swiper-item v-for="(item,index) in list" :key="index" style="overflow: auto;">
							<block v-for="qqm in 50">
								<view>
									123123123
								</view>
							</block>
						</swiper-item>
					</swiper>
				</view>
			</view>


		</z-paging>
		<!-- 组件 -->
		<u-popup mode="right" :show="showRightMenu" @close="showRightMenu = false" bgColor="#f4f4f4"
			customStyle="width:70vw">
			<u-gap height="44"></u-gap>
			<block v-for="(panel,index) in rightMenuItem" :key="index">
				<view style="margin:20rpx 20rpx 0 20rpx; background: #fff;border-radius: 20rpx;">
					<block v-for="(item,subindex) in panel">
						<u-row customStyle="padding:30rpx">
							<u-icon :name="item.icon" size="24" bold></u-icon>
							<text style="margin-left:20rpx;font-weight: 600;">{{item.name}}</text>
						</u-row>
					</block>
				</view>
			</block>
			<view style="position: fixed;bottom: 0;margin: 20rpx;background: #fff;border-radius: 20rpx; width: 65vw;">
				<u-row justify="space-between">
					<block v-for="(item,index) in static">
						<u-row customStyle="padding:30rpx;flex-direction:column;align-items:center;">
							<u-icon :name="item.icon" size="22" bold
								customStyle="background:#eee;padding:15rpx;border-radius:500rpx"></u-icon>
							<text style="font-size: 30rpx;color: #999;">{{item.name}}</text>
						</u-row>
					</block>
				</u-row>

			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				showRightMenu: false,
				rightMenuItem: {
					personl: [{
							name: '个人信息',
							icon: 'heart'
						},
						{
							name: '我的收藏',
							icon: 'heart'
						},
						{
							name: '浏览历史',
							icon: 'heart'
						}
					],
					all: [{
							name: '我的帖子',
							icon: 'heart'
						},
						{
							name: '我的订单',
							icon: 'heart'
						},
						{
							name: '我的小摊',
							icon: 'heart'
						}
					],
					blance: [{
							name: '我的钱包',
							icon: 'heart'
						},
						{
							name: '兑换中心',
							icon: 'heart'
						},
						{
							name: '商城',
							icon: 'heart'
						}
					]
				},
				static: [{
						name: '设置',
						path: '',
						icon: 'setting'
					}, {
						name: '反馈',
						path: '',
						icon: 'file-text'
					},
					{
						name: '客服',
						path: '',
						icon: 'kefu-ermai'
					},

				],
				scrollList: [{
						name: '创作中心',
						icon: 'heart',
						description: '作品收益管理'
					},
					{
						name: '我的小摊',
						icon: 'heart',
						description: '我所创作的作品'
					},
					{
						name: '商城',
						icon: 'heart',
						description: '虚拟商品列表'
					},
					{
						name: '兑换中心',
						icon: 'heart',
						description: '周边积分兑换'
					},
					{
						name: '我的钱包',
						icon: 'heart',
						description: '我的钱包'
					},
				],
				tabsIndex: 0,
				list: [{
						name: '发布'
					}, {
						name: '评论'
					},
					{
						name: '收藏'
					}
				],


			}
		},
		computed: {
			...mapState(['userInfo', 'userMeta'])
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				if (uni.getStorageSync('token')) {
					this.getUserInfo();
					this.getUserMeta();
				}
				setTimeout(() => {
					//1秒之后停止刷新动画
					this.$refs.paging.complete();
				}, 1000)
			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: this.userInfo.uid
					}
				}).then(res => {
					if (res.data.code) {
						this.$store.commit('setUser', res.data.data)
					}

				}).catch(err => {
					console.log(err)
				})
			},
			getUserMeta() {
				this.$http.get('/typechoUsers/userData').then(res => {
					if (res.data.code) {
						console.log(res)
						this.$store.commit('setUserMeta', res.data.data)
					}
				})
			},

			goLogout() {
				uni.showLoading({
					mask: true,
					title: '断开主程序中...'
				})
				setTimeout(() => {
					this.$store.commit('logout')
					uni.hideLoading()
				}, 1600)

			},
			goProfile() {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id: this.userInfo.uid
					}
				})
			},
			editProfile() {
				this.$Router.push({
					path: '/pages/user/editProfile'
				})
			},
			goLogin() {
				this.$Router.push({
					path: '/pages/user/login',
				})
			}
		}
	}
</script>

<style lang="scss">
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1);
		pointer-events: none;
	}
</style>