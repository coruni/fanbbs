<template>
	<z-paging-swiper>
		<index @avatarTap="avatarTap()" v-show="tabbarIndex == 0" @edit="showMoreMenu = true;data=$event"></index>
		<find v-show="tabbarIndex == 1" :index="1" :current="tabbarIndex"></find>
		<category v-show="tabbarIndex == 3" :index="3" :current="tabbarIndex"></category>
		<!-- 商城 -->
		<!-- <shop v-show="tabbarIndex == 3" :index="3" :current="tabbarIndex"></shop> -->
		<user v-show="tabbarIndex == 4" :index="4" :current="tabbarIndex"></user>
		<!-- 间隔 -->
		<!-- 底部导航栏 -->
		<template #bottom>
			<view class="bottom-tabbar">
				<u-row justify="space-between">
					<block v-for="(item,index) in tabbar" :key="index">
						<u-row style="flex-direction:column" v-if="index!=4" @click="tabbarTap(index)">
							<i class="ess" :class="item.active ? [item.cur, 'btn-active'] : item.icon"
								style="font-size: 45rpx;"></i>
							<text style="font-size: 28rpx;margin-top: 6rpx;"
								:class="{'btn-active':item.active}">{{item.name}}</text>
						</u-row>
					</block>
					<view class="tabbar-avatar" @tap.stop="tabbarTap(4)">
						<u-avatar :src="$store.state.userInfo.avatar" size="30" class="avatar"
							:class="{'animate__animated animate__rotateIn avatar_active':tabbarIndex==4}"></u-avatar>
					</view>
				</u-row>
			</view>
		</template>

		<!-- 组件开始 -->
		<u-popup :show="showPublish" @close="showPublish = false" customStyle="border-radius:20rpx 20rpx 0 0">
			<view style="margin: 30rpx;">
				<text style="font-weight:600">发布文章</text>
				<u-row justify="space-around" customStyle="margin-top:30rpx">
					<block v-for="(item,index) in publish" :key="index">
						<view style="
						display: flex;
						flex-direction: column;
						align-items: center;" @click="goPublish(item.path);showPublish=false">
							<i class="ess" :class="item.icon" style="font-size: 48rpx;
							background: #ff08004c;
							border-radius: 50rpx;
							display: inline-flex;
							color:white;
							padding: 20rpx;"></i>
							<text style="margin-top: 20rpx;">{{item.name}}</text>
						</view>
					</block>
				</u-row>
				<view style="margin-top: 30rpx;">
					<view style="font-size: 26rpx;color: #999;display: flex;flex-direction: column;">
						<text>1. 在本APP中发布内容则代表您接受本社区的服务条款以及用户协议</text>
						<text>2. 帖子：图文混搭、图片：仅发布图片、视频：仅发布视频</text>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="showMoreMenu" @close="showMoreMenu = false" :closeable="true" round="10">
			<view style="padding: 30rpx;">
				<view style="
				text-align: center;
				color: #999;">
					<text>分享至</text>
				</view>
				<view style="margin-top: 50rpx;">
					<u-row customStyle="border-bottom:1rpx solid #ff08000a;padding-bottom:30rpx" justify="space-around">
						<block v-for="(item,index) in share" :key="index">
							<u-row align="center" customStyle="flex-direction:column" @click="shareWithApi(item,data)">
								<view style="padding: 20rpx;border-radius: 100rpx;" :style="{background:item.color}">
									<u-icon :name="item.icon" color="white" size="24"></u-icon>
								</view>
								<text style="margin-top: 20rpx;">{{item.name}}</text>
							</u-row>
						</block>
					</u-row>
					<view style="
					display: flex;
					flex-direction: column;
					margin-top: 50rpx;">
						<u-row customStyle="margin-bottom:30rpx">
							<i class="ess mgc_alert_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">举报</text>
						</u-row>
						<u-row customStyle="margin-bottom: 30rpx;" @click="copyLink()">
							<i class="ess mgc_flash_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">复制链接</text>
						</u-row>
						<!-- #ifdef APP -->
						<u-row customStyle="margin-bottom: 30rpx;">
							<i class="ess mgc_share_forward_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx" @click="shareWithSystem()">通过系统分享</text>
						</u-row>
						<!-- #endif -->

					</view>
				</view>
			</view>
		</u-popup>

	</z-paging-swiper>

</template>

<script>
	import {
		shareTap,
		shareWithSystem,
		filterHtml
	} from '@/common/common.js';
	import index from './components/index.vue';
	import find from './components/find.vue';
	import user from './components/user.vue';
	import category from './components/category.vue';
	export default {
		components: {
			index,
			user,
			find,
			category,
		},
		data() {
			return {
				data: null,
				content: [],
				topTabbar: [{
					name: '首页',
				}],
				page: 1,
				data: null,
				showMoreMenu: false,
				topTabIndex: 0,
				tabbarIndex: 0,
				showPublish: false,
				publish: [{
						name: '帖子',
						type: 'article',
						icon: 'mgc_quill_pen_line',
						path: 'articlePublish'
					},
					{
						name: '图片',
						type: 'picture',
						icon: 'mgc_pic_line',
						path: 'photo'
					},
					{
						name: '视频',
						type: 'video',
						icon: 'mgc_play_circle_line',
						path: 'video'
					},
				],
				share: [{
						name: '微信',
						icon: 'weixin-fill',
						provider: 'weixin',
						type: 0,
						scene: 'WXSceneSession',
						color: '#46d262'
					},
					{
						name: '朋友圈',
						icon: 'moments',
						provider: 'weixin',
						type: 0,
						scene: 'WXSceneTimeline',
						color: '#46d262'
					},
					{
						name: 'QQ',
						icon: 'qq-fill',
						provider: 'qq',
						type: 2,
						scene: '',
						color: '#0070ff'
					},

				],
				tabbar: [{
						name: '首页',
						active: true,
						type: 'home',
						count: 0,
						icon: 'mgc_home_3_line',
						cur: 'mgc_home_3_fill'
					},
					{
						name: '动态',
						active: false,
						type: 'find',
						count: 0,
						icon: 'mgc_send_line',
						cur: 'mgc_send_fill'
					},
					{
						type: 'midbutton',
						icon: 'mgc_add_line'
					},
					{
						name: '板块',
						active: false,
						type: 'shop',
						count: 0,
						icon: 'mgc_three_circles_line',
						cur: 'mgc_three_circles_fill'
					},
				],
				lineBg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII='
			}
		},
		created() {

		},
		onReady() {},
		methods: {
			shareTap,
			filterHtml,

			animationfinish(data) {
				this.topTabIndex = data.detail.current
			},
			changeTab(data) {
				this.topTabIndex = data.index
			},
			tabbarTap(index) {
				if (index === 2) {
					this.showPublish = true
					return; // 当点击中间按钮时，直接返回，不执行后续逻辑
				}
				this.tabbar.forEach((item, i) => {
					item.active = i === index;
					this.tabbarIndex = index

				});
				// this.tabbarIndex = index
			},
			avatarTap() {
				this.tabbar.forEach((item, i) => {
					item.active = i === 4;
					this.tabbarIndex = 4
				});
				this.tabbarIndex = 4
			},
			goPublish(path) {
				if (!path) return;
				this.$Router.push({
					name: path
				})
				this.$Router.$lockStatus = false
			},
			shareWithSystem() {
				let data = this.data
				shareWithSystem(data.title, `${this.$config.h5}/#/pages/article/article?id=${data.cid}`).then(() => {
					this.showMoreMenu = false;
				})
			},
			shareWithApi(data, article) {
				shareTap(data.provider, data.type, data.scene, article.title, filterHtml(article.text),
					`${this.$config.h5}/#/pages/article/photo?id=${article.cid}`, article.images[0])
			},
			copyLink() {
				let data = this.data
				uni.setClipboardData({
					data: `${this.$config.h5}/#/pages/article/article?id=${data.cid}`,
					success: () => {
						uni.$u.toast('复制成功')
						this.showMoreMenu = false
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	.swiper {
		height: 100%;
	}

	.btn-active {
		color: #ff0800a0;
		/* 设置颜色 */
		transition: all ease-out 0.2s;
	}

	.bottom-tabbar {
		background: white;
		padding: 11rpx 30rpx;
		z-index: 999;
		border-top: #f7f7f7 2rpx solid;
	}

	.tabbar-avatar {
		display: flex;
		flex-direction: column;
		justify-content: center;
		justify-content: center;
		font-size: 28rpx;
	}


	.avatar {
		transition: all 0.2s ease;
		border: 4rpx solid #85a3ff32;

		&_active {
			border: 4rpx solid #ff0800a0 !important;
		}
	}
</style>