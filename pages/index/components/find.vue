<template>
	<z-paging-swiper>
		<template #top>
			<u-navbar placeholder>
				<view slot="left"></view>
				<view slot="center" v-if="isMounted">
					<u-tabs :list="tabs" :current="tabsIndex" lineColor="#85a3ff"
						:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
						:inactiveStyle="{color: '#606266',transform: 'scale(1)'}"
						:itemStyle="{fontSize:'16rpx',height:'30px'}" lineHeight="3"
						@change="tabsIndex = $event.index"></u-tabs>
				</view>
			</u-navbar>
		</template>
		<swiper style="height: 100%;" :current="tabsIndex" @animationfinish="tabsIndex = $event.detail.current"
			v-if="isMounted">
			<swiper-item>
				<articleItem></articleItem>
			</swiper-item>
			<swiper-item>
				<videoItem></videoItem>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import articleItem from './find/article.vue';
	import videoItem from './find/video.vue';
	export default {
		components: {
			articleItem,
			videoItem
		},
		name: 'find',
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
				tabs: [{
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

		}
	}
</script>

<style>
</style>