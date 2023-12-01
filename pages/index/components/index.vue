<template>
	<z-paging-swiper>
		<!-- 头部搜索框 -->
		<template #top>
			<u-navbar placeholder>
				<!-- 用slot占位取消返回图标 -->
				<view slot="left"></view>
				<view slot="center" style="flex: 1;margin: 0 20rpx;">
					<u-row>
						<u-icon name="gift" size="24" customStyle="background:#f7f7f7;border-radius:50rpx;padding:10rpx"
							@click="checkUp()"></u-icon>
						<view @click="goSearch()"
							style="display: flex;justify-content: space-between;flex:1;background: #f7f7f7;padding:6rpx 20rpx;border-radius: 50rpx;margin-left: 20rpx;">
							<text style="color: #999;">搜索</text>
							<u-icon name="search" size="20"></u-icon>
						</view>
						<u-avatar :src="userInfo.avatar" size="30" customStyle="margin-left:20rpx"
							@click="avatarTap()"></u-avatar>
					</u-row>
				</view>
			</u-navbar>
		</template>
		<!-- 模拟首屏开始 -->
		<u-tabs :list="topTabbar" lineWidth="20" lineHeight="7" @change="changeTab" :current="topTabIndex"
			:lineColor="`url(${lineBg}) 100% 100%`"
			:activeStyle="{color: '#a899e6',fontWeight: 'bold',transform: 'scale(1.05)'}"
			:inactiveStyle="{color: '#606266',transform: 'scale(1)'}"
			itemStyle="padding-left: 30rpx; padding-right: 30rpx; height: 68rpx;">
			<view slot="right" style="padding-left: 8rpx;margin-right: 20rpx;" @click="goCategoryList()">
				<u-icon name="list" size="20" bold></u-icon>
			</view>
		</u-tabs>
		<swiper style="height: 100%;" :current="topTabIndex" @animationfinish="animationfinish">
			<swiper-item v-for="(page,pageIndex) in topTabbar" :key="pageIndex">
				<articleIndex :swiper="pageIndex" :tabbar="topTabIndex" :mid="page.mid" v-if="!page.isrecommend"
					:isSwiper="!pageIndex" @edit="$emit('edit',$event)">
				</articleIndex>
				<water-fall-index v-else :swiper="pageIndex" :tabbar="topTabIndex"
					style="margin-bottom: 60rpx;background: #f7f7f7;"></water-fall-index>
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
				lineBg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAOCAYAAABdC15GAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFxSURBVHgBzZNRTsJAEIb/WTW+lpiY+FZPIDew3ABP4GJ8hxsI9zBpOYHeQDwBPQI+mRiRvpLojtPdYhCorQqF/6GdbGd2vvwzBXZcNAt4oj1ANeUoAT5iqkUjbEFLHNmhD1YPEvpZ3ghkGlVDCkc94/BmHMq998I5ONiY1ZBfpKAyuOtgAc5yOEDmYEWNh32BHF91sGHZHmwW4azciN9aQwnz3SJEgOmte+R2tdLprTYoa50mvuomlLpD4Y3oQZnov6D2RzCqI93bWOHaEmAGqQUyRBlZR1WfarcD/EJ2z8DtzDGvsMCwpm8XOCfDUsVOCYhiqRxI/CTQo4UOvjzO7Pow18vfywneuUHHUUxLn55lLw5JFpZ8bEUcY8oXdOLWiHLTxvoGpLqoUmy6dBT15o/ox3znpoycAmxUsiJTbs1cmxeVKp+0zmFIS7bGWiVghC7Vwse8jFKAX9eljh4ggKLLv7uaQvG9/F59Oo2SouxPu7OTCxN/s8wAAAAASUVORK5CYII='
			}
		},
		created() {
			this.initData()
		},
		computed: {
			...mapState(['userInfo'])
		},
		onReady() {},
		methods: {
			initData() {
				this.getCategory()
			},
			getCategory() {
				this.$http.get('/typechoMetas/metasList', {
					params: {
						page: 1,
						limit: 8,
						searchParams: JSON.stringify({
							type: 'category'
						})
					}
				}).then(res => {
					if (res.statusCode == 200) {
						this.topTabbar = this.topTabbar.concat(res.data.data)
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
			checkUp() {
				this.$http.post('/typechoUserlog/addLog', {
					params: JSON.stringify({
						type: 'clock'
					})
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						uni.$u.toast('签到'+res.data.msg)
					}else{
						if(res.data.msg!='你的操作太频繁了'){
							uni.$u.toast(res.data.msg)
						}
					}
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