<template>
	<z-paging-swiper>
		<index style="margin-bottom: 120rpx" @avatarTap="avatarTap()" v-show="tabbarIndex == 0"></index>
		<find v-show="tabbarIndex == 1" :index="tabbarIndex"></find>
		<user v-show="tabbarIndex == 4" :index="tabbarIndex"></user>
		<!-- 间隔 -->
		<template #bottom>

			<u-row justify="space-between" customStyle="padding:10rpx 30rpx 20rpx 30rpx;background:white;z-index:999">
				<block v-for="(item,index) in tabbar" :key="index">
					<u-row customStyle="flex-direction:column" @click="tabbarTap(index)" v-if="index!=4">
						<view style="position: relative;">
							<u-icon :name="item.icon" size="22" :color="item.active?'#a899e6':''"
								customStyle="z-index:2"
								:class="{'animate__animated animate__zoomIn':item.active}"></u-icon>
							<u-badge :isDot="true" bgColor="#a899e6c4" :offset="[12,7]" absolute
								customStyle="z-index: 1;" v-if="item.active&&item.type!='midbutton'"
								:class="{'animate__animated animate__heartBeat':item.active}"></u-badge>
						</view>
						<text :style="{color:item.active?'#a899e6':'',fontSize:30+'rpx'}">{{item.name}}</text>
					</u-row>
					<u-avatar :src="$store.state.userInfo.avatar" v-else size="35"
						customStyle="border:6rpx solid #ffa385" @click="tabbarTap(index)"></u-avatar>
				</block>
			</u-row>
		</template>
		<!-- 组件开始 -->
		<u-popup :show="showPublish" @close="showPublish = false" customStyle="border-radius:20rpx 20rpx 0 0">
			<view style="margin: 20rpx;">
				<view style="position: relative;text-align: center;">
					<u--text text="发布文章" size="16" bold customStyle="z-index:1"></u--text>
					<view
						style="z-index: 0;position: absolute;background-color: #a899e6;top: 30rpx;padding: 6rpx 68rpx;box-shadow: 0 0 9px 0 #a899e6;border-radius: 500rpx;">
					</view>
				</view>
				<u-row justify="space-around"
					customStyle="margin-top:30rpx;border-bottom:1rpx solid #cccccc36;padding-bottom:40rpx">
					<block v-for="(item,index) in publish" :key="index">
						<u-row customStyle="flex-direction:column;">
							<view style="background: #a899e64c;border-radius: 500rpx;padding: 15rpx;">
								<u-icon :name="item.icon" size="30" color="#a899e6"></u-icon>
							</view>
							<text style="margin-top: 10rpx;">{{item.name}}</text>
						</u-row>
					</block>
				</u-row>
				<view style="margin-top: 10rpx;">
					<u--text text="发动态" size="14"></u--text>
					<u--textarea placeholder="请输入内容" border="none" height="40"
						customStyle="background:#f7f7f7;margin-top:10rpx;margin-bottom:40rpx" disabled></u--textarea>
				</view>
			</view>
		</u-popup>
	</z-paging-swiper>

</template>

<script>
	import index from './components/index.vue';
	import find from './components/find.vue';
	import user from './components/user.vue';
	export default {
		components: {
			index,
			user,
			find
		},
		data() {
			return {
				content: [],
				topTabbar: [{
					name: '首页',
				}],
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
						// searchParams: JSON.stringify({
						// 	isrecommend: 1
						// })
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
				// this.tabbarIndex = index
			},
			avatarTap() {
				this.tabbar.forEach((item, i) => {
					item.active = i === 4;
					this.tabbarIndex = 4
				});
				this.tabbarIndex = 4
			}
		}
	}
</script>
<style>
	.swiper {
		height: 100%;
	}
</style>