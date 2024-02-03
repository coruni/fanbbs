<template>
	<z-paging-swiper>
		<template #top>
			<u-navbar placeholder autoBack style="position: relative;z-index: 10075;" bgColor="transparent">
				<!-- 用slot占位取消返回图标 -->
				<view slot="left">
					<i class="ess icon-left_line" style="font-size: 60rpx;" @click=""></i>
				</view>
				<view slot="center" style="margin: 0 20rpx;flex:1;margin-left:100rpx">
					<uv-search :showAction="false" v-model="search" actionText="搜索" :animation="true"  @search="searchTap = true"></uv-search>
				</view>
			</u-navbar>
			<view v-if="searchTap">
				<u-tabs :list="tabs" :current="tabsIndex" @change="tabsIndex = $event.index"></u-tabs>
			</view>
		</template>
		<swiper style="height: 100%;" @animationfinish="tabsIndex = $event.detail.current" :current="tabsIndex"
			v-if="searchTap">
			<swiper-item>
				<allArticle ref="allarticle" :search="search">
				</allArticle>
			</swiper-item>
			<swiper-item>
				<allArticle ref="allarticle" :search="search">
				</allArticle>
			</swiper-item>
			<swiper-item>
				<tagItem></tagItem>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import allArticle from './components/all.vue'
	import tagItem from './components/tag.vue'
	export default {
		components: {
			allArticle,
			tagItem
		},
		data() {
			return {
				showCategory: false,
				search: '',
				categories: [],
				article: [],
				tabsIndex: 0,
				searchTap: false,
				tabs: [{
						name: '综合'
					},
					{
						name: '帖子'
					}, {
						name: '话题'
					},
					{
						name: '用户'
					}
				],
			};
		},
		created() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page {
		background: #85a3ff0a;
	}
</style>