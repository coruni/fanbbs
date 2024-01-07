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
						<uv-search :showAction="false" placeholder="看你想看" :disabled="true"
							 :animation="true"
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
		<u-tabs :list="topTabbar" lineWidth="20" lineHeight="3" @change="changeTab" :current="topTabIndex"
			lineColor="#85a3ff" :activeStyle="{color: '#85a3ff',fontWeight: 'bold',transform: 'scale(1.05)'}"
			:inactiveStyle="{color: '#000',transform: 'scale(1)'}"
			itemStyle="padding-left: 30rpx; padding-right: 30rpx; height: 68rpx;">
			<view slot="right" style="padding-left: 8rpx;margin-right: 20rpx;" @click="goCategoryList()">
				<i class="ess icon-menu_line" style="font-size: 40rpx;"></i>
			</view>
		</u-tabs>
		<swiper style="height: 100%;" :current="topTabIndex" @animationfinish="animationfinish">
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
	import waterFallIndex from '@/components/article/waterfall.vue';
	import articleIndex from '@/components/article/index.vue';
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
			this.initData()
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
			initData() {
				this.getCategory()
			},
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
						this.topTabbar = this.topTabbar.concat(res.data.data.data)
					}
				})
			},
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