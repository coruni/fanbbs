<template>
	<view style="overflow: scroll;">
		<u-navbar id="navbar"
			:bgColor="theme === '#292929' ? $u.colorToRgba(theme, opacity) : $u.colorToRgba('#fff', opacity)">
			<view slot="left">
				<u-row>
					<!-- <u-icon name="scan" size="26"
						:color="opacity>0.4? (theme === '#292929' ? '#fff' : 'black') : 'white'"></u-icon> -->
					<u-row customStyle="margin-left:20rpx" v-show="opacity>=1" @click="$refs.paging.scrollToTop()">
						<u-avatar :src="userInfo && userInfo.avatar" size="26"></u-avatar>
						<text style="margin-left:20rpx">{{userInfo && userInfo.screenName}}</text>
					</u-row>
				</u-row>
			</view>
			<u-row slot="right">
				<i class="mgc_menu_line"
					:style="{color: opacity > 0.4 ? (theme === '#292929' ? '#fff' : 'black') : 'white'}"
					style="font-size: 44rpx; margin-right: 20rpx;" @click="showRightMenu = true">
				</i>
			</u-row>
		</u-navbar>
		<!-- 头部 -->
		<view style="position: relative;">
			<image :src="userInfo && userInfo.userBg?userInfo.userBg:'/static/login.jpg'" mode="aspectFill"
				class="backCover" @click="chooseBackImg()">
			</image>
			<view class="top-header"></view>
			<!-- 头像 -->
			<view class="avatar-position" @click="$store.state.hasLogin?goProfile():goLogin()">
				<u-avatar style="border: 6rpx solid #fff;" :src="userInfo && userInfo.avatar" size="80"></u-avatar>
				<image class="avatar_head" mode="aspectFill" :src="userInfo && userInfo.opt&&userInfo.opt.head_picture">
				</image>
			</view>
			<!-- 用户数据 -->
			<view class="data-position" style="width: 30%;" v-if="$store.state.hasLogin">
				<u-row justify="space-between">
					<u-col :span="6">
						<view class="userMate">
							<text style="font-size: 34rpx;font-weight: 600;">{{userInfo &&userInfo.follows}}</text>
							<text>关注</text>
						</view>
					</u-col>
					<u-col :span="6">
						<view class="userMate">
							<text style="font-size: 34rpx;font-weight: 600;">{{userInfo &&userInfo.fans}}</text>
							<text>粉丝</text>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		<!-- 内容 --> <!-- 间隔 -->
		<view style="padding: 40rpx;">
			<u-row justify="space-between" v-if="$store.state.hasLogin">
				<view>
					<u-row>
						<text style="font-weight: 600;font-size: 34rpx;"
							:class="{'vipname':userInfo&& userInfo.isVip}">{{userInfo && userInfo.screenName?userInfo.screenName:userInfo.name}}</text>
						<text
							:style="{border:`${userInfo && userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1]} solid 2rpx`,background:userInfo && userInfo.level > 8 ? $level[Math.floor(userInfo.level/2)-1] : $level[userInfo.level-1] }"
							class="level" v-if="userInfo.level" @click="showLevel = true">
							Lv.{{userInfo.level}}
						</text>
					</u-row>
					<u-row style="font-size: 26rpx;color: #999;">
						<text>通行证：</text>
						<text>{{userInfo&& userInfo.uid}}</text>
					</u-row>
				</view>
				<u-row class="wallet" justify="space-between" align="end" @click="goPage('wallet')">
					<i class="mgc_wallet_3_fill wallet-icon"></i>
					<text class="u-line-1" style="font-size: 28rpx;">{{userInfo&& userInfo.assets}}</text>
				</u-row>
			</u-row>
			<u-row v-else>
				<text style="font-weight: 600;font-size: 34rpx;" @click="goLogin()">哦~乐子神在上</text>
			</u-row>
		</view>
		<u-gap height="6" bg-color="#f7f7f7" class="article-gap"></u-gap>
		<view style="padding: 40rpx;" class="panel-container">
			<u-row style="height: 400rpx;" justify="space-between">
				<u-col :span="5" id="sign" @click="checkUp()">
					<view class="panel-article" :style="{backgroundColor:getTime.backgroundColor}">
						<view class="panel-article-text">
							<text>{{getTime.greeting}}</text>
							<text>{{(tasks && tasks.isSign && getTime.hour>=21) ||(tasks && tasks.isSign && getTime.hour<6)?'记得早点休息哦~':tasks && tasks.isSign?'今天的事务都完成了哦~':'今日戳戳小猫了吗？'}}</text>
						</view>
					</view>
				</u-col>
				<u-col :span="6.6" style="height: 100%;">
					<view class="panel">
						<view class="panel-photo">
							<u-row justify="space-around" style="height: 100%;flex: 1;">
								<view class="circle">
									<i class="circle-icon circle-icon-article mgc_document_fill" data-text="文章"></i>
									<text style="margin-top: 20rpx;">{{userInfo && userInfo.articles}}</text>

								</view>
								<view class="circle">
									<i class="circle-icon circle-icon-comment mgc_chat_4_fill" data-text="评论"></i>
									<text style="margin-top: 20rpx;">{{userInfo && userInfo.comments}}</text>
								</view>
								<view class="circle">
									<i class="circle-icon circle-icon-level mgc_heart_fill" data-text="经验"
										:style="{ background: fillStyle }"></i>
									<text style="margin-top: 20rpx;"
										v-if="$store.state.hasLogin">{{ Math.floor((userInfo.experience / userInfo.nextExp) * 100) }}%</text>
								</view>
							</u-row>
						</view>
						<view class="panel-video">
							<u-row justify="space-around" style="height: 100%;flex: 1;">
								<view class="circle" @click="goPage('editUser')">
									<i class="circle-icon circle-icon-user mgc_user_edit_fill"></i>
									<text style="margin-top: 20rpx;font-size: 24rpx;">信息</text>
								</view>
								<view class="circle" @click="goPage('headPicture')">
									<i class="circle-icon circle-icon-head mgc_bling_fill"></i>
									<text style="margin-top: 20rpx;font-size: 24rpx;">头像框</text>
								</view>
								<view class="circle">
									<i class="circle-icon circle-icon-rank mgc_drop_fill"></i>
									<text style="margin-top: 20rpx;font-size: 24rpx;">头衔</text>
								</view>
							</u-row>
						</view>
					</view>
				</u-col>
			</u-row>
		</view>
		<!-- 组件 -->
		<view style="padding: 40rpx;padding-top: 0rpx;">
			<text class="more">更多</text>
			<u-row style="margin-top: 30rpx;" justify="space-between">
				<u-col :span="3.8">
					<view class="more-content more-content-shop" @click="goPage('shop')">
						<text>商店</text>
						<i class="mgc_shop_line more-position"></i>
					</view>
				</u-col>
				<u-col :span="3.8">
					<view class="more-content more-content-order" @click="goPage('orderList')">
						<text>订单</text>
						<i class="mgc_coupon_line more-position"></i>
					</view>
				</u-col>
				<u-col :span="3.8">
					<view class="more-content more-content-reward" @click="goPage('myReward')">
						<text>奖品</text>
						<i class="mgc_gift_line more-position"></i>
					</view>
				</u-col>
			</u-row>
			<u-row style="margin-top: 30rpx;" justify="space-between">
				<u-col :span="3.8">
					<view class="more-content more-content-exchange" @click="goPage('exchange')">
						<text>兑换</text>
						<i class="mgc_sparkles_line more-position"></i>
					</view>
				</u-col>
				<u-col :span="3.8">
					<view class="more-content more-content-star" @click="goPage('collect')">
						<text>收藏</text>
						<i class="mgc_star_line more-position"></i>
					</view>
				</u-col>
				<u-col :span="3.8">
					<view class="more-content more-content-history" @click="goPage('history')">
						<text>历史</text>
						<i class="mgc_time_line more-position"></i>
					</view>
				</u-col>
			</u-row>
		</view>
		<view style="padding: 40rpx;padding-top: 0rpx;">
			<text class="more">系统</text>
			<u-row style="margin-top: 30rpx;">
				<i class="mgc_service_fill" style="font-size: 40rpx;"></i>
				<text style="margin-left: 20rpx;">联系客服</text>
			</u-row>
			<u-row style="margin-top: 30rpx;color: red;" @click="goLogout()">
				<i class="mgc_exit_line" style="font-size: 40rpx;"></i>
				<text style="margin-left: 20rpx;">退出</text>
			</u-row>
		</view>
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
	import articleItem from '../components/user/article.vue';
	import commentItem from '../components/user/comment.vue'
	export default {
		components: {
			articleItem,
			commentItem
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
				hours: 0,
			}
		},
		computed: {
			...mapState(['userInfo']),
			getTime() {
				var date = new Date();
				var hour = date.getHours();
				var greeting = "";
				var backgroundColor = "";

				if (hour >= 6 && hour < 12) {
					greeting = "早上好喵~";
					backgroundColor = "#f07b3f"; // 早上的背景色
				} else if (hour >= 12 && hour < 18) {
					greeting = "中午好喵~";
					backgroundColor = "#ffd460"; // 中午的背景色
				} else {
					greeting = "晚上好喵~";
					backgroundColor = "#2d4059"; // 晚上的背景色
				}

				return {
					greeting,
					backgroundColor,
					hour
				};
			},
			fillStyle() {
				// 计算百分比
				const percentage = Math.floor((this.userInfo.experience || 0 / this.userInfo.nextExp || 0) * 100);
				// 根据百分比返回填充样式
				return `conic-gradient(#ff0800 ${percentage}%, transparent ${percentage}% 100%)`;
			},
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
		onShow() {
			let date = new Date();
			this.hours = date.getHours()
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
					// this.$refs.collect.reload()
					this.getUserInfo()
				}

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
				}).catch(err => {})
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
				if (this.tasks.isSign) return;
				this.$http.post('/user/sign').then(res => {
					if (res.data.code == 200) {
						uni.$u.toast(res.data.msg)
						this.getUserTasks()
					}
				})
			},
			getUserTasks() {
				this.$http.get('/user/tasks').then(res => {
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
		background-color: rgba(0, 0, 0, 0.15);
		pointer-events: none;
	}

	.userMate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: white;
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
		width: 100%;
		height: 500rpx;
		transform: scale(1);
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

	.avatar-position {
		position: absolute;
		bottom: -60rpx;
		margin: 40rpx;
	}

	.level {
		font-size: 18rpx;
		padding: 0 16rpx;
		border-radius: 50rpx;
		margin-left: 20rpx;
		color: white;
	}

	.data-position {
		position: absolute;
		right: 0;
		bottom: 0;
		padding: 40rpx;
	}

	.wallet {
		background: #09244b;
		color: white;
		width: 140rpx;
		border-radius: 10rpx;
		overflow: hidden;
		padding: 10rpx;

		&-icon {
			color: white;
			font-size: 45rpx;
		}
	}

	.panel-container {
		background-image: url('@/static/user/sign_background.webp');
		background-repeat: no-repeat;
		background-size: contain;
		background-position: right;
	}

	.panel {
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: space-between;

		&-article {
			display: flex;
			position: relative;
			justify-content: center;
			align-items: flex-end;
			background-color: #f38181;
			border-radius: 10rpx;
			width: 100%;
			height: 400rpx;
			color: white;
			background-image: url('@/static/user/sign_background.webp') !important;
			background-repeat: no-repeat !important;
			background-position: center 300rpx !important;
			background-size: cover !important;
			transition: all ease 0.5s;

			&:hover {
				background-position: 0 22rpx !important;

				.panel-article-text {
					bottom: 200rpx;
					color: #78bbde;

				}
			}

			&-text {
				overflow: hidden;
				display: flex;
				padding: 0 20rpx;
				flex-direction: column;
				position: absolute;
				bottom: 100rpx;
				transition: all 0.5s ease;
			}
		}


		&-photo {
			border-radius: 10rpx;
			background: #fce38af0;
			width: 100%;
			height: 190rpx;
		}

		&-video {
			border-radius: 10rpx;
			background: #ffaaa5f0;
			width: 100%;
			height: 190rpx;
		}
	}

	.circle {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
	}

	.circle-icon {
		padding: 20rpx;
		border-radius: 50rpx;
		color: white;
		font-size: 40rpx;
		position: relative; // 添加相对定位
		transition: all 0.3s ease; // 添加过渡效果

		&::after {
			content: attr(data-text); // 获取 data-text 属性作为文字内容
			position: absolute; // 绝对定位
			left: 50%;
			font-size: 24rpx;
			font-weight: 600;
			width: 100%;
			text-align: center;
			transform: translateX(-50%); // 水平居中
			bottom: -30rpx; // 距离图标底部 30rpx
			opacity: 0; // 初始时文字不可见
			transition: opacity 0.3s ease; // 添加过渡效果
		}

		&:hover {
			transform: translateY(-10rpx); // 悬停时向上平移 10rpx

			&::after {
				opacity: 1; // 悬停时文字可见
			}
		}

		&-article {
			background-color: #ff8c94;
			box-shadow: 0 0 10rpx 0 #ff8c94;
		}

		&-comment {
			background-color: #0dceda;
			box-shadow: 0 0 10rpx 0 #0dceda;
		}

		&-level {
			background-color: #ff0800;
			box-shadow: 0 0 10rpx 0 #ff0800;
		}

		&-user {
			background-color: #ffaa64;
			box-shadow: 0 0 10rpx 0 #ffaa64;
		}

		&-rank {
			background-color: #6eb6ff;
			box-shadow: 0 0 10rpx 0 #6eb6ff;
		}

		&-head {
			background-color: #f67280;
			box-shadow: 0 0 10rpx 0 #f67280;
		}
	}

	.more {
		font-weight: 600;
		position: relative;

		::after {
			content: "";
			position: absolute;
			bottom: -8rpx;
			height: 6rpx;
			background: #2d4059;
			border-radius: 50rpx;
			left: 0;
			width: 100%;
		}

		&-position {
			position: absolute;
			overflow: hidden;
			right: 0;
			top: 0;
			opacity: 0.5;
			font-size: 160rpx;
		}

		&-content {
			position: relative;
			overflow: hidden;
			padding: 30rpx;
			border-radius: 20rpx;
			color: white;

			&-shop {
				background: #80d6fff0;
			}

			&-order {
				background: #f47c7cf0;
			}

			&-reward {
				background: #fab57af0;
			}

			&-exchange {
				background: #f06868f0;
			}

			&-star {
				background: #a393ebf0;
			}

			&-history {
				background: #455d7af0;
			}
		}
	}
</style>