<template>
	<z-paging-swiper>
		<template #top>
			<u-navbar placeholder bgColor="transparent">
				<view slot="left"></view>
				<view slot="center" style="flex:1" v-if="isMounted">
					<z-tabs ref="tabs" :list="list" :scrollCount="2" :current="tabsIndex"
						@change="tabsChange" active-color="#ff0800" bar-animate-mode="worm" bgColor="transparent"></z-tabs>
				</view>
			</u-navbar>
		</template>
		<swiper style="height: 100%;" :current="tabsIndex" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
			<swiper-item>
				<articleItem @edit="$emit('edit',$event)"></articleItem>
			</swiper-item>
			<swiper-item>
				<videoItem style="margin-bottom: 110rpx;"  class="waterfall-home"></videoItem>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import articleItem from './discover/article.vue';
	import videoItem from './discover/video.vue';
	export default {
		components: {
			articleItem,
			videoItem
		},
		name: 'discovery',
		props: {
			index: {
				type: [String, Number],
				default: 0
			},
			current: {
				type: [String, Number],
				default: 0
			}
		},
		watch: {
			current: {
				handler(e) {
					if (e == this.index) this.isMounted = true
				}
			}
		},
		data() {
			return {
				article: [],
				commentData: {},
				showComments: false,
				list: [{
						name: '关注',
						type: 'all'
					},
					{
						name: '视频',
						type: 'video'
					}
				],
				swiperIndex: 0,
				tabsIndex: 0,
				isMounted: false,
			}
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
		}
	}
</script>

<style lang="scss">
	.waterfall-home{
		background: #f7f7f7;
	}
</style>