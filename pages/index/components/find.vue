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
		<swiper style="height: 100%;" :current="tabsIndex" @animationfinish="tabsIndex = $event.detail.current" v-if="isMounted" >
			<swiper-item v-for="(item,index) in tabs" :key="index">
				<articleItem :type="item.type" @comments="showComments = true;commentData = $event"></articleItem>
			</swiper-item>
		</swiper>
		<u-popup :show="showComments" @close="showComments = false" customStyle="border-radius:40rpx 40rpx 0 0">
			<!-- 使用view包裹 防止子组件等待撑开 -->
			<view>
				<commentItem :data="commentData"></commentItem>
			</view>
		</u-popup>
	</z-paging-swiper>
</template>

<script>
	import commentItem from './find/comment.vue';
	import articleItem from './find/article.vue';
	export default {
		components: {
			articleItem,
			commentItem
		},
		name: 'find',
		props: {
			index: {
				type: [String, Number],
				default: 0
			}
		},
		watch: {
			index: {
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
						name: '发现',
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