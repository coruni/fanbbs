<template>
	<z-paging-swiper>
		<swiper style="height: 100%;">
			<swiper-item v-show="!loading">
				<z-paging refresher-only>
					<template #top>
						<u-navbar placeholder autoBack @rightClick="showMore = true" fixed>
							<view slot="right">
								<u-icon name="more-dot-fill"></u-icon>
							</view>
						</u-navbar>
					</template>
					<view style="margin: 10rpx 20rpx 20rpx 20rpx;" v-if="article">
						<articleHeader :data="author"></articleHeader>
						<articleContent :data="article"></articleContent>
						<articleFooter :data="article"></articleFooter>
					</view>
					<!-- 评论区 -->
					<u-gap height="10" bgColor="#f7f8f7"></u-gap>
					<template #bottom>
						<u-row customStyle="margin:20rpx" justify="space-between">
							<u-col span="6">
								<view>
									<u-input prefix-icon="edit-pen" border="none" placeholder="说点什么..."
										class="u-info-light-bg" customStyle="padding:6rpx 10rpx;border-radius:50rpx" />
								</view>
							</u-col>
							<u-col span="5">
								<u-row customStyle="margin-left:20rpx;flex:1" justify="space-between">
									<view style="display: flex; flex-direction: column;align-items: center;">
										<u-icon name="rmb-circle" size="18"></u-icon>
										<u-text text="发电" size="10"></u-text>
									</view>
									<view style="display: flex; flex-direction: column;align-items: center;">
										<u-icon name="star" size="20"></u-icon>
										<u-text text="收藏" size="10"></u-text>
									</view>
									
									<view style="display: flex; flex-direction: column;align-items: center;">
										<u-icon name="thumb-up" size="20"></u-icon>
										<u-text text="点赞" size="10"></u-text>
									</view>
								</u-row>
							</u-col>
						</u-row>
					</template>
				</z-paging>

			</swiper-item>
			<swiper-item></swiper-item>
		</swiper>
		<u-loading-page :loading="loading"></u-loading-page>
		<!-- 页面公用组件 -->
		<!-- 分享&&管理弹窗 -->
		<u-popup :show="showMore" @close="showMore = false" customStyle="padding:30rpx" round="20">
			<u-row justify="space-between" style="border-bottom:1px solid #f7f8f7;padding-bottom: 30rpx;">
				<u-col span="2" v-for="(item,index) in share" :key="index" align="center"
					customStyle="flex-direction:column" @click="shareTap">
					<view :style="{background:item.color,borderRadius:'50rpx',padding:'20rpx'}">
						<u-icon :name="item.icon" color="white" size="26"></u-icon>
					</view>
					<text style="margin-top:10rpx">{{item.name}}</text>
				</u-col>
			</u-row>
			<u-row customStyle="margin-top:30rpx">
				<u-col span="2" v-for="(item,manageIndex) in manage" :key="manageIndex" align="center"
					customStyle="flex-direction:column" @click="manageTap">
					<view :style="{borderRadius:'50rpx',padding:'20rpx'}" class="u-info-light-bg">
						<u-icon :name="item.icon" size="26"></u-icon>
					</view>
					<text style="margin-top:10rpx">{{item.name}}</text>
				</u-col>
			</u-row>
		</u-popup>
	</z-paging-swiper>
</template>

<script>
	import articleHeader from '@/pages/article/components/header.vue';
	import articleContent from '@/pages/article/components/content.vue';
	import articleFooter from '@/pages/article/components/footer.vue';
	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter
		},
		data() {
			return {
				cid: 0,
				article: null,
				comments: [],
				author: null,
				loading: true,
				showMore: false,
				share: [{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					}
				],
				manage: [{
						name: '举报',
						icon: 'warning'
					},
					{
						name: '编辑',
						icon: 'warning'
					}
				]
			};
		},
		onLoad(params) {
			// GetStorage 获取存储本地的文章简略信息
			this.cid = params.id
			this.author = uni.getStorageSync(`article_${params.id}`)
			this.getData(params.id)
			setTimeout(() => {
				this.loading = false
			}, 700)
		},
		beforeCreate() {

		},
		created() {

		},
		methods: {
			shareTap(index) {
				console.log(index)
			},
			getData(id) {
				this.$http.get('/typechoContents/contentsInfo', {
					params: {
						key: id,
						isMd: 1
					}
				}).then(res => {
					if (res.statusCode == 200) {
						this.article = res.data
						console.log(res.data)
					}
				})
			},
			getComments(page, limit) {
				this.$http.get('/typechoComments/commentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'comment',
							cid: this.cid
						})
					}
				}).then(res => {
					console.log(res)
				})
			}
		}
	}
</script>

<style lang="scss">

</style>