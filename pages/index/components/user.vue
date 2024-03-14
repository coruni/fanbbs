<template>
	<view>
		<z-paging ref="paging" refresher-only @onRefresh="onRefresh" @scroll="scroll"
			:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false"
			v-if="$store.state.hasLogin&&isMounted" style="margin-bottom: 50rpx;">
			<template #top>
				<u-navbar id="navbar"
					:bgColor="theme === '#292929' ? $u.colorToRgba(theme, opacity) : $u.colorToRgba('#fff', opacity)">
					<view slot="left">
						<u-row>
							<u-icon name="scan" size="26"
								:color="opacity>0.4? (theme === '#292929' ? '#fff' : 'black') : 'white'"></u-icon>
							<u-row customStyle="margin-left:20rpx" v-show="opacity>=1"
								@click="$refs.paging.scrollToTop()">
								<u-avatar :src="userInfo && userInfo.avatar" size="26"></u-avatar>
								<text style="margin-left:20rpx">{{userInfo && userInfo.screenName}}</text>
							</u-row>
						</u-row>
					</view>
					<u-row slot="right">
						<i class="ess mgc_menu_line"
							:style="{color: opacity > 0.4 ? (theme === '#292929' ? '#fff' : 'black') : 'white'}"
							style="font-size: 44rpx; margin-right: 20rpx;" @click="showRightMenu = true">
						</i>
					</u-row>
				</u-navbar>
			</template>
			<view style="position: relative;">
				<image :src="userInfo && userInfo.userBg?userInfo.userBg:'/static/login.jpg'" mode="aspectFill"
					style="width: 100%;height: 500rpx;transform: scale(1);" class="backCover" @click="chooseBackImg()">
				</image>
				<view class="top-header"></view>
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
								<text style="font-weight: 600;font-size: 34rpx;"
									:class="{'vipname':userInfo&& userInfo.isVip}">{{userInfo && userInfo.screenName?userInfo.screenName:userInfo.name}}</text>
								<uv-line-progress :height="4"
									:activeColor="userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1]"
									:percentage="100-((userInfo.nextLevel - userInfo.experience) / userInfo.nextExp) * 100"
									:showText="false" style="position: absolute;bottom: 0;width: 100%;"
									v-if="userInfo && userInfo.experience && userInfo.nextLevel && userInfo.level">
								</uv-line-progress>
							</view>

							<text
								:style="{border:`${userInfo && userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1]} solid 2rpx`,background:userInfo && userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1] }"
								style="font-size: 18rpx;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx;color: white;"
								v-if="userInfo.level" @click="showLevel = true">
								Lv.{{userInfo.level}}
							</text>
						</u-row>
						<u-row customStyle="font-size:28rpx">
							<i class="ess mgc_renwu" style="margin-right: 10rpx;"></i>
							<text>通行证ID：{{userInfo && userInfo.uid}}</text>
						</u-row>
						<u-row customStyle="font-size:28rpx;color: #999;">
							<i class="ess mgc_ziliao" style="margin-right: 10rpx;"></i>
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
						<u-button plain v-if="!$store.state.tasks.isSign" color="#ff0800" shape="circle"
							customStyle="height:60rpx" @click="checkUp()">
							<i class="ess mgc_leaf_line"></i>
							<text>签到</text>
						</u-button>
						<u-button v-if="$store.state.tasks.isSign" color="#ffe085" shape="circle"
							customStyle="height:60rpx" @click="checkUp()">
							<i class="ess mgc_leaf_line"></i>
							<text>已签到</text>
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
			<u-gap height="6" bg-color="#f7f7f7" class="article-gap"></u-gap>
			<view v-if="$store.state.hasLogin &&isMounted">
				<!-- #ifndef APP -->
				<u-sticky bgColor="#fff">
					<z-tabs ref="tabs" :list="list" :scrollCount="1" :current="tabsIndex" @change="tabsChange"
						active-color="#ff0800" :active-style="{fontWeight:'bold'}" bar-animate-mode="worm"
						class="tabs-dark"></z-tabs>
				</u-sticky>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<u-sticky bgColor="#fff" :offsetTop="sticky">
					<z-tabs ref="tabs" :list="list" :scrollCount="1" :current="tabsIndex" @change="tabsChange"
						active-color="#ff0800" :active-style="{fontWeight:'bold'}" bar-animate-mode="worm"
						class="tabs-dark"></z-tabs>
				</u-sticky>
				<!-- #endif -->
				<swiper style="height: 100vh;" :current="tabsIndex" @transition="swiperTransition"
					@animationfinish="swiperAnimationfinish" v-if="$store.state.hasLogin && isMounted">
					<swiper-item style="overflow: auto;">
						<publish :isScroll="isScroll" :data="userInfo" ref="publish"
							@articleMenu="showArticleMenu = true;edit = $event"></publish>
					</swiper-item>
					<swiper-item style="overflow: auto;">
						<comment :isScroll="isScroll" :data="userInfo" ref="comment"></comment>
					</swiper-item>
				</swiper>
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
				<view class="rightPanel">
					<block v-for="(item,subindex) in panel">
						<u-row customStyle="padding:30rpx" @click="goPage(item.path);showRightMenu = false">
							<i class="ess" :class="item.icon" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx;font-weight: 600;">{{item.name}}</text>
						</u-row>
					</block>
				</view>
			</block>
			<!-- 管理面板 -->
			<view style="position: fixed;bottom: 0; width: 70vw;">
				<view class="rightPanel-bottom">
					<u-row justify="space-between">
						<u-row style="flex-direction: column;" justify="center" @click="goLogout()">
							<i class="ess mgc_flash_line rightPanel-bottom-icon"></i>
							<text style="font-size: 26rpx;margin-top: 10rpx;">退出</text>
						</u-row>
						<u-row style="flex-direction: column;" justify="center">
							<i class="ess mgc_clipboard_line rightPanel-bottom-icon"></i>
							<text style="font-size: 26rpx;margin-top: 10rpx;">反馈</text>
						</u-row>
						<u-row style="flex-direction: column;" justify="center" @click="goPage('setting')">
							<i class="ess mgc_settings_1_line rightPanel-bottom-icon"></i>
							<text style="font-size: 26rpx;margin-top: 10rpx;">设置</text>
						</u-row>
					</u-row>
				</view>
			</view>
		</u-popup>
		<l-clipper v-if="backgroundShow" :image-url="cropperBg"
			@success="upload($event.url,false); backgroundShow = false" @cancel="backgroundShow = false" is-limit-move
			is-lock-ratio :width="1280" :height="720" :scaleRatio="2" :min-width="1280" :min-height="720"
			:max-width="1920" :max-height="720" style="z-index: 99999;" />

		<!-- 等级弹窗 -->
		<u-popup mode="center" :show="showLevel" @close="showLevel = false" round="10">
			<view style="width: 500rpx;padding: 30rpx;">
				<view style="text-align: center;">
					<text>等级详情</text>
				</view>
				<view style="display: flex;flex-direction: column;font-size: 28rpx;">
					<u-row>
						<text>当前等级：</text>
						<i @click="showLevel = true" v-if="userInfo.level" :class="`level mgc_lv-${userInfo.level}`"
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
						<u-row @click="goEdit()">
							<i class="ess mgc_edit_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">编辑</text>
						</u-row>
					</view>
					<view style="margin-bottom:30rpx">
						<u-row style="color: red;" @click="showDelete = true">
							<i class="ess mgc_delete_2_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">删除</text>
						</u-row>
					</view>
				</view>
			</view>

			<!-- 删除弹出框 -->
			<u-popup :show="showDelete" :round="10" mode="center" @close="showDelete = false"
				customStyle="width:500rpx">
				<view
					style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
					<text style="font-size: 34rpx;">提示</text>
					<view style="margin-top:30rpx">
						<text>是否确定删除？</text>
					</view>
					<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
						<u-button plain color="#ff0800" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
							@click="showDelete = false">取消</u-button>
						<u-button color="#ff0800" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
							@click="deleteArticle()">确定</u-button>
					</u-row>
				</view>
			</u-popup>
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
							icon: 'mgc_quill_pen_line',
							path: 'editUser'
						},
						{
							name: '我的收藏',
							icon: 'mgc_star_line',
							path: 'collect'
						},
						{
							name: '浏览历史',
							icon: 'mgc_time_line',
							path: 'history',
						}
					],
					all: [{
							name: '我的订单',
							icon: 'mgc_bill_line',
							path: 'orderList',
						},
						{
							name: '我的小摊',
							icon: 'mgc_shopping_cart_2_line',
							path: 'myProduct',
						},
						{
							name: '我的奖品',
							icon: 'mgc_gift_2_line',
							path: 'myReward',
						}
					],
					blance: [{
							name: '我的钱包',
							icon: 'mgc_wallet_3_line',
							path: 'wallet',
						},
						{
							name: '兑换中心',
							icon: 'mgc_coin_2_line',
							path: 'exchange',
						},
						{
							name: '商城',
							icon: 'mgc_shopping_bag_3_line',
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
				tasks: {},
				edit: {},
				showDelete: false,
				theme: '#fff',
				sticky: 0,
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
			if (uni.getSystemInfoSync().theme == 'dark') this.theme = '#292929'
			uni.onThemeChange((res) => {
				if (res.theme == 'dark') this.theme = "#292929";
				else this.theme = '#fff'
			})
			let system = uni.getSystemInfoSync()
			this.sticky = system.statusBarHeight + 44
			
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
					if (res.data.code == 200) {
						this.$store.commit('setUser', res.data.data)
					}
				}).catch(err => {

				})
			},

			goLogout() {
				this.$store.commit('logout');
				this.$Router.replaceAll({
					path: '/pages/index/index'
				})
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

					if (res.data.code == 200) {
						this.save(res.data.data.url)
					}
				})
			},
			save(url) {
				this.$http.post('/user/update', {
					background: url
				}).then(res => {
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
			goEdit() {
				let data = this.edit
				this.$Router.push({
					path: data.type == 'post' ? '/publish/article/article' : '',
					query: {
						update: 1,
						id: this.edit.cid
					}
				})
				this.showArticleMenu = false;
			},
			deleteArticle() {
				let data = this.edit
				this.$http.post('/article/delete', {
					id: data.cid
				}).then(res => {
					if (res.data.code == 200) {
						this.showDelete = false
						this.$refs.publish.reload()
						this.showArticleMenu = false
					}
					uni.$u.toast(res.data.msg)
				})
			},
		}
	}
</script>

<style lang="scss">
	@media (prefers-color-scheme: dark) {
		.userPanel {
			background: #292929 !important;
		}

		.tabs-dark {
			background: #292929 !important;
			color: white;
		}

		.rightPanel {
			background: #525252 !important;

			&-bottom {
				background: #525252 !important;

				&-icon {
					background: #606060 !important;
				}
			}
		}
	}

	.top-header {
		width: 100%;
		border-radius: 30rpx 30rpx 0 0;
		height: 40rpx;
		position: absolute;
		bottom: 0;
		background: white;
	}

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
		padding: 0 40rpx 40rpx 40rpx;
	}

	.u-button::before {
		background: #ff0800;
	}

	.backCover {
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.backCover::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.btn {
		border-radius: 50rpx;
		height: 60rpx;
	}

	.rightPanel {
		margin: 30rpx 30rpx 0 30rpx;
		background: #fff;
		border-radius: 20rpx;

		&-bottom {
			margin: 30rpx;
			background: #fff;
			border-radius: 20rpx;
			padding: 30rpx;

			&-icon {
				font-size: 40rpx;
				padding: 14rpx;
				border-radius: 50rpx;
				background: #f7f7f7;
				color: red;
			}
		}
	}
</style>