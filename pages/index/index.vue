<template>
	<z-paging-swiper>
		<index @avatarTap="avatarTap()" v-show="tabbarIndex == 0" @edit="showMoreMenu = true;data=$event"></index>
		<find v-show="tabbarIndex == 1" :index="tabbarIndex"></find>
		<notice v-show="tabbarIndex == 3" :index="tabbarIndex"></notice>
		<user v-show="tabbarIndex == 4" :index="tabbarIndex"></user>
		<!-- 间隔 -->
		<template #bottom>

			<u-row justify="space-between" customStyle="padding:10rpx 30rpx 20rpx 30rpx;background:white;z-index:999">
				<block v-for="(item,index) in tabbar" :key="index">
					<u-row customStyle="flex-direction:column" @click="tabbarTap(index)" v-if="index!=4">
						<view style="position: relative;padding: 20rpx;">
							<u-icon :name="item.icon" size="22" :color="item.active?'#85a3ff':''"
								customStyle="z-index:2"
								:class="{'animate__animated animate__zoomIn':item.active}"></u-icon>
							<u-badge :isDot="true" bgColor="#85a3ffc4" :offset="[12,7]" absolute
								customStyle="z-index: 1;" v-if="item.active&&item.type!='midbutton'"
								:class="{'animate__animated animate__heartBeat':item.active}"></u-badge>
						</view>
					</u-row>
					<u-avatar :src="$store.state.userInfo.avatar" v-else size="35"
						customStyle="border:6rpx solid #85a3ff" @click="tabbarTap(index)"
						:class="{'animate__animated animate__pulse':tabbarIndex==4}"></u-avatar>
				</block>
			</u-row>
		</template>
		<!-- 组件开始 -->
		<u-popup :show="showPublish" @close="showPublish = false" customStyle="border-radius:20rpx 20rpx 0 0">
			<view style="margin: 20rpx;">
				<view style="position: relative;text-align: center;">
					<u--text text="发布文章" size="16" bold customStyle="z-index:1"></u--text>
					<view
						style="z-index: 0;position: absolute;background-color: #85a3ff;top: 30rpx;padding: 6rpx 68rpx;box-shadow: 0 0 9px 0 #85a3ff;border-radius: 500rpx;">
					</view>
				</view>
				<u-row justify="space-around"
					customStyle="margin-top:30rpx;border-bottom:1rpx solid #cccccc36;padding-bottom:40rpx">
					<block v-for="(item,index) in publish" :key="index">
						<u-row customStyle="flex-direction:column;" @click="goPublish(item);showPublish = false">
							<view style="background: #85a3ff4c;border-radius: 500rpx;padding: 15rpx;">
								<u-icon :name="item.icon" size="30" color="#85a3ff"></u-icon>
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
		<u-popup :show="showMoreMenu" @close="showMoreMenu = false" :closeable="true" round="10">
			<view style="padding: 30rpx;">
				<view style="text-align: center;color: #999;">
					<text>分享至</text>
				</view>
				<view style="margin-top: 50rpx;">
					<u-row customStyle="border-bottom:1rpx solid #85a3ff0a;padding-bottom:30rpx"
						justify="space-between">
						<block v-for="(item,index) in share" :key="index">
							<u-row align="center" customStyle="flex-direction:column">
								<view style="padding: 20rpx;border-radius: 100rpx;" :style="{background:item.color}">
									<u-icon :name="item.icon" color="white" size="24"></u-icon>
								</view>
								<text style="margin-top: 20rpx;">{{item.name}}</text>
							</u-row>
						</block>
					</u-row>
					<view style="display: flex;flex-direction: column;margin-top: 50rpx;">
						<u-row customStyle="margin:20rpx 0">
							<u-icon name="thumb-down" size="24"></u-icon>
							<text style="margin-left:10rpx">我不喜欢这类内容</text>
						</u-row>
						<u-row customStyle="margin:20rpx 0">
							<u-icon name="share" size="24"></u-icon>
							<text style="margin-left:10rpx">复制链接</text>
						</u-row>
						<u-row customStyle="margin:20rpx 0">
							<u-icon name="more-dot-fill" size="24"></u-icon>
							<text style="margin-left:10rpx">通过系统分享</text>
						</u-row>
					</view>
				</view>
			</view>
		</u-popup>

	</z-paging-swiper>

</template>

<script>
	import index from './components/index.vue';
	import find from './components/find.vue';
	import user from './components/user.vue';
	import notice from './components/notice.vue';
	export default {
		components: {
			index,
			user,
			find,
			notice
		},
		data() {
			return {
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
						icon: 'edit-pen',
						path: 'articlePublish'
					},
					{
						name: '图片',
						type: 'picture',
						icon: 'photo',
						path: 'photo'
					},
					{
						name: '视频',
						type: 'video',
						icon: 'play-circle',
						path: 'video'
					},
				],
				share: [{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '朋友圈',
						icon: 'moments',
						color: 'green'
					},
					{
						name: 'QQ',
						icon: 'qq-fill',
						color: 'blue'
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
			},
			goPublish(data) {
				if (!data) return;
				this.$Router.push({
					name: data.path
				})
				this.$Router.$lockStatus = false
			}
		}
	}
</script>
<style>
	.swiper {
		height: 100%;
	}
</style>