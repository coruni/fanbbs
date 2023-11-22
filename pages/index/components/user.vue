<template>
	<view>
		<z-paging ref="paging" refresher-only @onRefresh="onRefresh" @scroll="scroll"
			:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false" v-if="$store.state.hasLogin">
			<template #top>
				<u-navbar :bgColor="`rgba(255,255,255,${opacity})`">
					<view slot="left">
						<u-row>
							<u-icon name="scan" size="26" :color="opacity>0.4? 'black':'white'"></u-icon>
							<u-row customStyle="margin-left:20rpx" v-show="opacity>=1"
								@click="$refs.paging.scrollToTop()">
								<u-avatar :src="userInfo.avatar" size="26"></u-avatar>
								<text style="margin-left:20rpx">{{userInfo.screenName}}</text>
							</u-row>
						</u-row>
					</view>
					<u-icon name="setting" slot="right" size="26" :color="opacity>0.4? 'black':'white'"
											@click="showRightMenu = true"></u-icon>
				</u-navbar>
			</template>
			<image :src="userInfo.userBg?userInfo.userBg:'/static/login.png'" mode="aspectFill"
				style="width: 100%;height: 400rpx;transform: scale(1);"></image>
			<view class="userPanel">
				<view style="position: absolute;top: -80rpx;">
					<u-avatar :src="userInfo.avatar" size="80">
					</u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="userInfo && userInfo.opt&&userInfo.opt.head_picture">
					</image>
				</view>

				<u-row justify="space-between" align="top" customStyle="padding-top:20rpx">
					<view>
						<!-- 占位脱离文档流头像 -->
						<u-gap height="40"></u-gap>
						<!-- 占位结束 -->
						<text style="font-weight: 600;font-size: 34rpx;">{{userInfo.screenName}}</text>
						<u-row customStyle="font-size:28rpx">
							<u-icon name="heart" color="#a899e6" customStyle="margin-right:10rpx"></u-icon>
							<text>通行证ID：{{userInfo.uid}}</text>
						</u-row>

						<u-row customStyle="font-size:28rpx">
							<u-icon name="pushpin" customStyle="margin-right:10rpx"></u-icon>
							<text style="color: #999;">{{userInfo.introduce?userInfo.introduce:'系统默认签名~'}}</text>
						</u-row>
					</view>
					<view>
						<u-button plain color="#a899e6" shape="circle" customStyle="height:60rpx"
							@click="goPage('editUser')">
							<u-icon name="edit-pen" color="#a899e6"></u-icon>
							<text>编辑</text>
						</u-button>
					</view>
				</u-row>
				<u-row justify="space-around" customStyle="margin-top:40rpx">
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userMeta.contentsNum}}</text>
						<text>帖子</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userMeta.followNum}}</text>
						<text>关注</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userMeta.fanNum}}</text>
						<text>粉丝</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userMeta.commentsNum}}</text>
						<text>评论</text>
					</view>
				</u-row>

				<view style="margin-top: 40rpx;">
					<view
						style="background: #a899e6c8;color: white;padding: 12rpx 30rpx 12rpx 30rpx;border-radius: 10rpx;">
						<text>创作中心</text>
					</view>
				</view>
			</view>
			<view style="position: relative;top: -60rpx;">
				<view v-if="$store.state.hasLogin">
					<!-- #ifndef APP -->
					<u-sticky bgColor="#fff">
						<u-tabs :list="list" lineColor="#a899e6" activeStyle="color:#303133;font-weight:bold;"
							:current="tabsIndex" inactiveStyle="color:#999" @change="tabsIndex = $event.index"
							v-if="isMounted"></u-tabs>
					</u-sticky>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<u-sticky bgColor="#fff" offsetTop="60">
						<u-tabs :list="list" lineColor="#a899e6" activeStyle="color:#303133;font-weight:bold"
							:current="tabsIndex" inactiveStyle="color:#999" @change="tabsIndex = $event.index"
							v-if="isMounted"></u-tabs>
					</u-sticky>
					<!-- #endif -->
					<swiper style="height: 100vh;" :current="tabsIndex"
						@animationfinish="tabsIndex = $event.detail.current" v-if="$store.state.hasLogin">
						<swiper-item style="overflow: auto;">
							<publish :isScroll="isScroll" :data="userInfo" ref="publish"></publish>
						</swiper-item>
						<swiper-item style="overflow: auto;">
							<comment :isScroll="isScroll" :data="userInfo" ref="comment"></comment>
						</swiper-item>
					</swiper>
				</view>
			</view>

		</z-paging>
		<view v-else style="margin-top: 40vh;text-align: center;">
			<text style="font-weight: bold;" @click="goLogin">登录查看更多精彩</text>
		</view>
		<!-- 组件 -->
		<u-popup mode="right" :show="showRightMenu" @close="showRightMenu = false" bgColor="#f4f4f4"
			customStyle="width:70vw">
			<u-gap height="44"></u-gap>
			<block v-for="(panel,index) in rightMenuItem" :key="index">
				<view style="margin:20rpx 20rpx 0 20rpx; background: #fff;border-radius: 20rpx;">
					<block v-for="(item,subindex) in panel">
						<u-row customStyle="padding:30rpx" @click="goPage(item.path)">
							<u-icon :name="item.icon" size="24"></u-icon>
							<text style="margin-left:20rpx;font-weight: 600;">{{item.name}}</text>
						</u-row>
					</block>
				</view>
			</block>
			<view style="position: fixed;bottom: 0;margin: 20rpx;background: #fff;border-radius: 20rpx; width: 65vw;">
				<u-row justify="space-between" @click="goLogout">
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
	import publish from '../components/user/publish.vue';
	import comment from '../components/user/comment.vue'
	export default {
		components: {
			publish,
			comment
		},
		props: {
			index: {
				type: [String, Number],
				default: 0,
			}
		},
		watch: {
			index: {
				handler(e) {
					if (e == 4) this.isMounted = true;
					if (this.$store.state.hasLogin) this.onRefresh();
				}
			}
		},
		data() {
			return {
				showRightMenu: false,
				isMounted: false,
				rightMenuItem: {
					personl: [{
							name: '个人信息',
							icon: 'heart',
							path: 'editUser'
						},
						{
							name: '我的收藏',
							icon: 'heart',
							path: 'collect'
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
				opacity: 0,
				allHeight: 0,
				isScroll: false,
			}
		},
		computed: {
			...mapState(['userInfo', 'userMeta'])
		},
		created() {},
		onReady() {},
		methods: {
			onRefresh() {
				if (this.$store.state.hasLogin) {
					this.$refs.publish.reload()
					this.$refs.comment.reload()
					// this.$refs.collect.reload()
					this.getUserInfo()
					this.getUserMeta()

				}
				setTimeout(() => {
					this.$refs.paging.complete()
				}, 1000)

			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: this.userInfo.uid
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$store.commit('setUser', res.data.data)
					}

				}).catch(err => {
					console.log(err)
				})
			},
			getUserMeta() {
				this.$http.post('/typechoUsers/userData').then(res => {
					if (res.data.code) {
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
			goPage(path) {
				this.$Router.push({
					name: path
				})
			},
			goLogin() {
				this.$Router.push({
					path: '/pages/user/login',
				})
			},
			scroll(data) {
				const scrollTop = data.detail.scrollTop;
				this.opacity = scrollTop / 100;
				if (scrollTop > 407) this.isScroll = true;
				else this.isScroll = false;
			},
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

	.userMate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
	}

	.userPanel {
		position: relative;
		top: -60rpx;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		padding: 0 40rpx 40rpx 40rpx;
		border-bottom: 1rpx solid #f7f7f7;
	}
</style>