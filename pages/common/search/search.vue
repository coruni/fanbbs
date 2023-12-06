<template>
	<z-paging-swiper>
		<template #top>
			<u-navbar placeholder style="position: relative;z-index: 10075;" bgColor="transparent">
				<!-- 用slot占位取消返回图标 -->
				<view slot="left"></view>
				<view slot="center" style="flex: 1;margin: 0 20rpx;">
					<u-row justify="space-between">
						<view
							style="border: 1rpx solid #85a3ff;border-radius: 50rpx;padding:10rpx;display: flex;align-items: center;flex:1">
							<view @click="showCategory=!showCategory" style="display: flex;align-items: center;">
								<u-avatar
									:src="selectCategory && selectCategory.imgurl?selectCategory.imgurl:'/static/login.png'"
									size="20"></u-avatar>
								<u-icon size="10" color="#999"
									:name="showCategory?'arrow-up-fill':'arrow-down-fill'"
									style="margin-left: 20rpx;padding-right: 20rpx;margin-right: 10rpx;border-right: #85a3ff solid 1rpx;"></u-icon>
							</view>
							<u-input v-model="search" :adjust-position="false" style="padding: 0 10rpx;"
								border="none" @input="inputSearch()" @confirm="searchTap=true"
								@focus="searchTap = false"></u-input>
						</view>
						<text style="color: #85a3ff;margin-left:20rpx" @click="$Router.back(1)">取消</text>
					</u-row>
				</view>
			</u-navbar>
			<view v-if="searchTap">
				<u-tabs :list="tabs" :current="tabsIndex" @change="tabsIndex = $event.index"></u-tabs>
			</view>
		</template>
		<z-paging @query="search?inputSearch:''" v-model="article" ref="paging" :refresher-enabled="false" :fixed="false" v-if="!searchTap">
			<!-- 搜索关键词 -->
			<view v-show="search && article &&!searchTap">
				<block v-for="(item,index) in article">
					<view style="margin: 30rpx;" @click="searchTap = true;search = item.title">
						<text class="u-line-1">{{item.title}}</text>
					</view>
				</block>
			</view>
			<!-- 组件 -->
			<u-popup mode="top" @close="showCategory = false" :show="showCategory"
				style="position: absolute;z-index: 10074;" round="20">
				<u-gap height="60"></u-gap>
				<z-paging ref="category" :fixed="false" height="600rpx" @query="getCategory" v-model="categories"
					:refresher-enabled="false">
					<view style="margin:0 20rpx;display: flex;flex-direction: column;">
						<u-row customStyle="padding: 20rpx 10rpx;"
							@click="selectCategory = null;showCategory = false">
							<u-avatar src="/static/login.png" size="24"></u-avatar>
							<text style="margin-left:20rpx">全部</text>
						</u-row>
						<block v-for="(item,index) in categories" :key="index">
							<u-row customStyle="padding: 20rpx 10rpx;"
								@click="selectCategory = item;showCategory = false">
								<u-avatar :src="item.imgurl" size="24"></u-avatar>
								<text style="margin-left:20rpx">{{item.name}}</text>
							</u-row>
						</block>
					</view>
					<view slot="loadingMoreDefault"></view>
				</z-paging>
			</u-popup>
			<template #loadingMoreNoMore></template>
		</z-paging>
		<swiper style="height: 100%;" @animationfinish="tabsIndex = $event.detail.current" :current="tabsIndex"
			v-if="searchTap">
			<swiper-item>
				<allArticle ref="allarticle" :search="search"
					:mid="selectCategory&&selectCategory.mid?selectCategory.mid:0">
				</allArticle>
			</swiper-item>
			<swiper-item>
				<allArticle ref="allarticle" :search="search"
					:mid="selectCategory&&selectCategory.mid?selectCategory.mid:0">
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
				selectCategory: {},
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
			this.initData()
		},
		methods: {
			initData() {

			},
			getCategory(page, limit) {
				this.$http.get('/typechoMetas/metasList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'category'
						}),
					}
				}).then(res => {
					console.log(res)
					this.$refs.category.complete(res.data.data)
				})
			},
			inputSearch(page, limit) {
				if(!this.search.length) return;
				this.$http.get('/typechoContents/contentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							mid: this.selectCategory && this.selectCategory.mid ? this.selectCategory.mid :
								''
						}),
						searchKey: this.search
					}
				}).then(res => {
					this.$refs.paging.complete(res.data.data)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #85a3ff0a;
	}
</style>