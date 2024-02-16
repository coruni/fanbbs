<template>
	<view>
		<z-paging ref="paging" refresher-only @onRefresh="onRefresh" @scroll="scroll"
			:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false"
			v-if="$store.state.hasLogin&&isMounted" style="margin-bottom: 50rpx;">
			<template #top>
				<u-navbar :bgColor="`rgba(255,255,255,${opacity})`">
					<view slot="left">
						<u-row>
							<u-icon name="scan" size="26" :color="opacity>0.4? 'black':'white'"></u-icon>
							<u-row customStyle="margin-left:20rpx" v-show="opacity>=1"
								@click="$refs.paging.scrollToTop()">
								<u-avatar :src="userInfo && userInfo.avatar" size="26"></u-avatar>
								<text style="margin-left:20rpx">{{userInfo && userInfo.screenName}}</text>
							</u-row>
						</u-row>
					</view>
					<u-row slot="right">
						<i class="ess icon-settings_1_line" :style="{color:opacity>0.4? 'black':'white'}"
							style="font-size: 44rpx;margin-right: 20rpx;" @click="showRightMenu =true"></i>
					</u-row>
				</u-navbar>
			</template>
			<view style="position: relative;">
				<image :src="userInfo && userInfo.userBg?userInfo.userBg:'/static/login.jpg'" mode="aspectFill"
					style="width: 100%;height: 400rpx;transform: scale(1);" class="backCover" @click="chooseBackImg()">
				</image>
				<view style="width: 100%;border-radius: 30rpx 30rpx 0 0;height: 40rpx;position: absolute;bottom: 0;background: white;"></view>
			</view>
			<view class="userPanel">
				<view style="position: absolute;top: -100rpx;">
					<u-avatar :src="userInfo && userInfo.avatar" size="80">
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
						<u-row>
							<view style="position: relative;top: 0;">
								<text
									style="font-weight: 600;font-size: 34rpx;">{{userInfo && userInfo.screenName?userInfo.screenName:userInfo.name}}</text>
								<uv-line-progress :height="4"
									:activeColor="userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1]"
									:percentage="100-((userInfo.nextLevel - userInfo.experience) / userInfo.nextExp) * 100"
									:showText="false" style="position: absolute;bottom: 0;width: 100%;"
									v-if="userInfo && userInfo.experience && userInfo.nextLevel && userInfo.level">
								</uv-line-progress>
							</view>
							<i @click="showLevel = true" v-if="userInfo.level"
								:class="`level icon-lv-${userInfo.level}`" style="font-size: 50rpx; margin-left: 20rpx;"
								:style="{ color: userInfo && userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1] }">
							</i>
						</u-row>
						<u-row customStyle="font-size:28rpx">
							<i class="ess icon-renwu" style="margin-right: 10rpx;"></i>
							<text>通行证ID：{{userInfo && userInfo.uid}}</text>
						</u-row>
						<u-row customStyle="font-size:28rpx;color: #999;">
							<i class="ess icon-ziliao" style="margin-right: 10rpx;"></i>
							<text>{{userInfo && userInfo.introduce?userInfo.introduce:'系统默认签名~'}}</text>
						</u-row>
					</view>
					<view>
						<u-button plain color="#ff0800" shape="circle" customStyle="height:60rpx"
							@click="goPage('editUser')">
							<u-icon name="edit-pen" color="#ff0800"></u-icon>
							<text>编辑</text>
						</u-button>
						<u-gap></u-gap>
						<u-button :plain="!$store.state.tasks.isSign"
							:color="$store.state.tasks.isSign?'#ffe085':'#ff0800'" shape="circle"
							customStyle="height:60rpx" @click="checkUp()">
							<i class="ess icon-leaf_line"></i>
							<text>{{tasks && tasks.isSign?'已签到':'签到'}}</text>
						</u-button>
					</view>
				</u-row>
				<u-row justify="space-around" customStyle="margin-top:40rpx">
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userMeta && userMeta.articles}}</text>
						<text>帖子</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userMeta && userMeta.follows}}</text>
						<text>关注</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userMeta && userMeta.fans}}</text>
						<text>粉丝</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userMeta && userMeta.comments}}</text>
						<text>评论</text>
					</view>
				</u-row>
			</view>
			
			<view style="position: relative;top: 0rpx;" v-if="isMounted">
				<view v-if="$store.state.hasLogin">
					<!-- #ifndef APP -->
					<u-sticky bgColor="#fff">
						<z-tabs ref="tabs" :list="list" :scrollCount="1" :current="tabsIndex" @change="tabsChange"
							active-color="#ff0800" :active-style="{color:'#303133',fontWeight:'bold'}"
							bar-animate-mode="worm"></z-tabs>

					</u-sticky>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<u-sticky bgColor="#fff" offsetTop="64">
						<z-tabs ref="tabs" :list="list" :scrollCount="1" :current="tabsIndex" @change="tabsChange"
							active-color="#ff0800" :active-style="{color:'#303133',fontWeight:'bold'}"
							bar-animate-mode="worm"></z-tabs>
					</u-sticky>
					<!-- #endif -->
					<swiper style="height: 100vh;" :current="tabsIndex" @transition="swiperTransition"
						@animationfinish="swiperAnimationfinish" v-if="$store.state.hasLogin && isMounted">
						<swiper-item style="overflow: auto;">
							<publish :isScroll="isScroll" :data="userInfo" ref="publish"
								@articleMenu="showArticleMenu = true"></publish>
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
						<u-row customStyle="padding:30rpx" @click="goPage(item.path);showRightMenu = false">
							<i class="ess" :class="item.icon" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx;font-weight: 600;">{{item.name}}</text>
						</u-row>
					</block>
				</view>
			</block>
			<!-- 管理面板 -->
			<view style="margin:20rpx 20rpx 0 20rpx; background: #fff;border-radius: 20rpx;"
				v-if="userInfo && userInfo.group =='administrator'">
				<u-row customStyle="padding:30rpx" @click="goPage('manage')">
					<i class="ess icon-settings_1_line" style="font-size: 40rpx;"></i>
					<text style="margin-left:20rpx;font-weight: 600;">管理面板</text>
				</u-row>
			</view>
			<view style="position: fixed;bottom: 0; width: 70vw;">
				<view style="margin: 20rpx;background: #fff;border-radius: 20rpx;padding: 20rpx;">
					<u-row justify="space-between">
						<u-row style="flex-direction: column;" justify="center" @click="goLogout()">
							<i class="ess icon-flash_line"
								style="font-size: 40rpx;padding: 14rpx;border-radius: 50rpx;background: #f7f7f7;color: red;"></i>
							<text style="font-size: 26rpx;margin-top: 10rpx;">退出</text>
						</u-row>
						<u-row style="flex-direction: column;" justify="center">
							<i class="ess icon-clipboard_line"
								style="font-size: 40rpx;padding: 14rpx;border-radius: 50rpx;background: #f7f7f7;"></i>
							<text style="font-size: 26rpx;margin-top: 10rpx;">反馈</text>
						</u-row>
						<u-row style="flex-direction: column;" justify="center">
							<i class="ess icon-headphone_line"
								style="font-size: 40rpx;padding: 14rpx;border-radius: 50rpx;background: #f7f7f7;"></i>
							<text style="font-size: 26rpx;margin-top: 10rpx;">客服</text>
						</u-row>
					</u-row>
				</view>
			</view>
		</u-popup>
		<l-clipper v-if="backgroundShow" :image-url="cropperBg"
			@success="upload($event.url,false); backgroundShow = false" @cancel="backgroundShow = false" is-limit-move
			is-lock-ratio :width="1280" :height="720" :min-width="1280" :min-height="720" :max-width="1920"
			:max-height="720" style="z-index: 99999;" />

		<!-- 等级弹窗 -->
		<u-popup mode="center" :show="showLevel" @close="showLevel = false" round="10">
			<view style="width: 500rpx;padding: 30rpx;">
				<view style="text-align: center;">
					<text>等级详情</text>
				</view>
				<view style="display: flex;flex-direction: column;font-size: 28rpx;">
					<u-row>
						<text>当前等级：</text>
						<i @click="showLevel = true" v-if="userInfo.level" :class="`level icon-lv-${userInfo.level}`"
							style="font-size: 50rpx; margin-left: 20rpx;"
							:style="{ color: userInfo && userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1] }">
						</i>
					</u-row>
					<view style="display: flex;flex-direction: column;margin-top: 30rpx;">
						<text
							style="color: #999;">下一级所需经验{{userInfo && userInfo.experience}}/{{userInfo && userInfo.nextExp}}</text>
						<u-line-progress :height="4"
							:activeColor="userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1]"
							:percentage="100-((userInfo && userInfo.nextExp - userInfo.experience) / userInfo.nextExp) * 100"
							:showText="false" v-if="userInfo"></u-line-progress>
					</view>
				</view>
				<view style="margin-top: 60rpx;">
					<u-button color="#ff0800" shape="circle" @click="showLevel = false">确定</u-button>
				</view>
			</view>
		</u-popup>

		<!-- 文章菜单 -->
		<u-popup :show="showArticleMenu" round="10" @close="showArticleMenu = false" closeable>
			<view style="margin: 30rpx;text-align: center;">
				<text>帖子管理</text>
				<view style="display: flex;
				flex-direction: column;">
					<view style="margin-bottom:30rpx">
						<u-row>
							<i class="ess icon-edit_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">编辑</text>
						</u-row>
					</view>
					<view style="margin-bottom:30rpx">
						<u-row style="color: red;">
							<i class="ess icon-delete_2_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">删除</text>
						</u-row>
					</view>
				</view>

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
			},
			current: {
				type: [String, Number],
				default: 0
			}
		},
		watch: {
			current: {
				handler(e) {
					if (e == this.index && this.$store.state.hasLogin) {
						this.isMounted = true;
						this.$nextTick(() => {
							this.onRefresh();
						})
					}

				},
				immediate: true
			}
		},

		data() {
			return {
				showLevel: false,
				showRightMenu: false,
				isMounted: false,
				backgroundShow: false,
				cropperBg: null,
				rightMenuItem: {
					personl: [{
							name: '个人信息',
							icon: 'icon-quill_pen_line',
							path: 'editUser'
						},
						{
							name: '我的收藏',
							icon: 'icon-star_line',
							path: 'collect'
						},
						{
							name: '浏览历史',
							icon: 'icon-time_line',
							path: '',
						}
					],
					all: [{
							name: '我的订单',
							icon: 'icon-bill_line',
							path: 'orderList',
						},
						{
							name: '我的小摊',
							icon: 'icon-shopping_cart_2_line',
							path: 'myProduct',
						}
					],
					blance: [{
							name: '我的钱包',
							icon: 'icon-wallet_3_line',
							path: 'wallet',
						},
						{
							name: '兑换中心',
							icon: 'icon-coin_2_line',
							path: '',
						},
						{
							name: '商城',
							icon: 'icon-shopping_bag_3_line',
							path: 'shop',
						}
					]
				},
				static: [{
						name: '退出',
						path: '',
						type: 'logout',
						icon: 'setting'
					}, {
						name: '反馈',
						path: '',
						type: '',
						icon: 'file-text'
					},
					{
						name: '客服',
						path: '',
						type: '',
						icon: 'kefu-ermai'
					},

				],
				scrollList: [{
						name: '创作中心',
						icon: 'heart',
						description: '作品收益管理',
						path: '',
					},
					{
						name: '我的小摊',
						icon: 'heart',
						description: '我所创作的作品',
						path: '',
					},
					{
						name: '商城',
						icon: 'heart',
						description: '虚拟商品列表',
						path: 'shop',
					},
					{
						name: '兑换中心',
						icon: 'heart',
						description: '周边积分兑换',
						path: '',
					},
					{
						name: '我的钱包',
						icon: 'heart',
						description: '我的钱包',
						path: '',
					},
				],
				tabsIndex: 0,
				list: [{
					name: '发布'
				}, {
					name: '评论'
				}, ],
				opacity: 0,
				allHeight: 0,
				isScroll: false,
				showArticleMenu: false,
				tasks: {}
			}
		},
		computed: {
			...mapState(['userInfo', 'userMeta'])
		},
		created() {
			uni.$on('login', data => {
				this.$store.commit('loginStatus')
				this.isMounted = true
			})
			this.tasks = uni.getStorageSync('userTasks')
		},
		methods: {
			//tabs通知swiper切换
			tabsChange(index) {
				this.tabsIndex = index;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.tabsIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
			},
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
				this.$http.get('/user/userInfo', {
					params: {
						id: this.userInfo.uid,
					},

				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.$store.commit('setUser', res.data.data)
					}

				}).catch(err => {
					console.log(err)
				})
			},
			getUserMeta() {
				this.$http.get('/user/userData', {}).then(res => {
					if (res.data.code == 200) {
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
			chooseBackImg() {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					success: (res) => {
						this.cropperBg = res.tempFilePaths[0];
						this.backgroundShow = true
					}
				})
			},
			upload(url, ) {
				this.$http.upload('/upload/full', {
					filePath: url,
					name: 'file'
				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.save(res.data.data.url)
					}
				})
			},
			save(url) {
				this.$http.post('/user/update', {
					background: url
				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.getUserInfo()
					}
				})
			},
			goPage(path) {
				if (!path && path == "") return;
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
			bottomTap(data) {
				switch (data.type) {
					case 'logout':
						this.goLogout();
						break;
					default:
						break;
				}
			},
			checkUp() {
				this.$http.post('/user/sign').then(res => {
					if (res.data.code == 200) {
						uni.$u.toast(res.data.msg)
						this.tasks.isSign = true;
						this.getUserTasks()
					}
				})
			},
			getUserTasks() {
				http.get('/user/tasks', {}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setTasks', res.data.data);
						this.tasks = res.data.data
					}
				})
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
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		padding: 0 40rpx 40rpx 40rpx;
		border-bottom: 1rpx solid #f7f7f7;
	}

	.u-button::before {
		background: #ff0800;
	}

	.backCover {
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
		filter: blur(1px);
	}

	.backCover::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>