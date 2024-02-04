<template>
	<z-paging-swiper>
		<!-- 头部搜索框 -->
		<template #top>
			<u-navbar placeholder>
				<!-- 用slot占位取消返回图标 -->
				<view slot="left"></view>
				<view slot="center" style="flex: 1;margin: 0 20rpx;">
					<u-row>
						<u-avatar :src="userInfo.avatar" size="30" customStyle="margin-right:20rpx"
							@click="avatarTap()"></u-avatar>
						<uv-search :showAction="false" placeholder="看你想看" :disabled="true" :animation="true"
							@click="goSearch()"></uv-search>
						<view style="position: relative;top: 0;">
							<i class="ess icon-notification_line" style="margin-left:20rpx;font-size: 40rpx;"
								@tap.stop="goNotice()"></i>
							<i class="ess icon-round_fill" v-if="$store.state.noticeNum.total"
								style="position: absolute;top:0;right: 0;color: red;font-size: 18rpx;"></i>
						</view>
					</u-row>
				</view>
			</u-navbar>
		</template>
		<!-- 模拟首屏开始 -->
		<z-tabs ref="tabs" :list="topTabbar" :scrollCount="1" :current="topTabIndex" @change="tabsChange"
			active-color="#85a3ff" bar-animate-mode="worm"></z-tabs>
		<swiper style="height: 100%;" :current="topTabIndex" @transition="swiperTransition"
			@animationfinish="swiperAnimationfinish">
			<swiper-item v-for="(page,pageIndex) in topTabbar" :key="pageIndex">
				<articleIndex :swiper="pageIndex" :tabbar="topTabIndex" :mid="page.mid" v-if="!page.iswaterfall"
					:isSwiper="!pageIndex" @edit="$emit('edit',$event)">
				</articleIndex>
				<water-fall-index v-else :swiper="pageIndex" :mid="page.mid" :tabbar="topTabIndex"
					style="margin-bottom: 170rpx;background: #85a3ff0a;"></water-fall-index>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import waterFallIndex from '@/components/waterfall.vue';
	import articleIndex from '@/components/index.vue';
	export default {
		components: {
			articleIndex,
			waterFallIndex
		},
		name: 'index',
		data() {
			return {
				content: [],
				topTabbar: [{
					name: '首页',
				}],
				showMoreMenu: false,
				data: null,
				page: 1,
				topTabIndex: 0,
				tabbarIndex: 0,
				showPublish: false,
				publish: [{
						name: '帖子',
						type: 'article',
						icon: 'edit-pen'
					},
					{
						name: '图片',
						type: 'picture',
						icon: 'photo'
					},
					{
						name: '视频',
						type: 'video',
						icon: 'play-circle'
					},
				],
				tabbar: [{
						name: '首页',
						active: true,
						count: 0,
						icon: 'home'
					},
					{
						name: '动态',
						active: false,
						count: 0,
						icon: 'arrow-up'
					},
					{
						type: 'midbutton',
						icon: 'plus'
					},
					{
						name: '消息',
						active: false,
						count: 0,
						icon: 'bell'
					},
					{
						name: '我的',
						active: false,
						count: 0,
						icon: 'account'
					},
				],
				searchFoucs: false,
			}
		},
		created() {
			if (uni.getStorageSync('topList').length > 1) {
				this.topTabbar = uni.getStorageSync('topList')
			}
			this.getCategory()

		},
		computed: {
			...mapState(['userInfo'])
		},
		onReady() {},
		beforeRouteLeave(to, from, next) {
			if (this.showPublish || this.showMoreMenu) {
				this.showMoreMenu = false
				this.showPublish = false
				return
			}
			next()
		},
		methods: {
			getCategory() {
				this.$http.get('/category/list', {
					params: {
						page: 1,
						limit: 8,
						params: JSON.stringify({
							type: 'category',
							isrecommend: 1,
						})
					}
				}).then(res => {
					if (res.statusCode == 200) {
						let topList = [{
							name: '首页'
						}]
						topList = topList.concat(res.data.data.data)
						this.topTabbar = topList
						// 缓存 
						uni.setStorageSync('topList', topList)
					}
				})
			},
			//tabs通知swiper切换
			tabsChange(index) {
				this.topTabIndex = index;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.topTabIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
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
				console.log(index);
			},
			goCategoryList() {
				this.$Router.push({
					name: 'categoryList'
				})
			},
			avatarTap() {
				if (this.$store.state.hasLogin) this.$emit('avatarTap', true);
				else this.goLogin()
			},
			goLogin() {
				this.$Router.push({
					path: '/pages/user/login'
				})
			},
			goSearch() {
				console.log('点击了搜索')
				this.$Router.push({
					path: '/pages/common/search/search'
				})
			},
			goNotice() {
				this.$Router.push({
					path: '/pages/index/components/notice',

				})
			}
		}
	}
</script>

<style>
	.swiper {
		height: 100%;
	}
</style>