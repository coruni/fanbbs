<template>
	<z-paging ref="paging" refresher-only @onRefresh="onRefresh" @scroll="scroll">
		<template #top>
			<u-navbar autoBack :bgColor="`rgba(255,255,255,${opacity})`" id="navbar"></u-navbar>
		</template>
		<image :src="info.avatar" mode="aspectFill" style="width: 100%;height: 380rpx;background: #000;"></image>
		<view style="position: relative;top: -50rpx;background: #fff;border-radius: 40rpx 40rpx 0 0;">
			<view id="profile">
				<u-avatar :src="info.avatar" size="80"
					customStyle="position:absolute;top:-80rpx;margin-left:60rpx;border:6rpx solid #fff"></u-avatar>
				<u-row justify="end" customStyle="padding:20rpx">
					<view>
						<u-button color="#FB7299C4" plain size="normal"
							customStyle="height:50rpx;border-radius:20rpx">私信</u-button>
					</view>
					<view style="margin-left:30rpx">
						<u-button color="#FB7299C4" size="normal"
							customStyle="height:50rpx;padding:0 60rpx ;border-radius:20rpx">关注</u-button>
					</view>
				</u-row>
				<view style="margin:20rpx">
					<u-row justify="space-between">
						<u-row>
							<text :style="{color:info.isvip?'#FB7299':'',fontSize:50+'rpx'}">{{info.screenName}}</text>
							<text
								style="font-size: 20rpx;color:white;margin-left:10rpx;background:#FB7299;padding:0 10rpx;border-radius:8rpx;box-shadow:0 0 9rpx 0 #FB7299">
								{{'Lv.'+ info.lv}}
							</text>
						</u-row>
					</u-row>
					<u-row class="u-info">
						<u-icon name="file-text" size="20" class="u-info"></u-icon>
						<text class="u-line-1">{{info.introduce?info.introduce:'暂时还没有简介哦~'}}</text>
					</u-row>
					<u-icon name="checkmark-circle-fill" label="管理员" color="red"
						v-if="info.groupKey=='administrator'"></u-icon>
				</view>
				<u-gap height="8" custom-style="background:#f4f4f4"></u-gap>
			</view>
			<!-- #ifndef H5 -->
			<u-sticky offsetTop="60">
				<u-tabs :list="tabs" lineColor="#FB7299" :current="tabbarIndex" style="background: white;"
					:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
					:inactiveStyle="{color: '#606266',transform: 'scale(1)'}" @change="changTab">
				</u-tabs>
			</u-sticky>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<u-sticky>
				<u-tabs :list="tabs" lineColor="#FB7299" :current="tabbarIndex" style="background: white;"
					:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
					:inactiveStyle="{color: '#606266',transform: 'scale(1)'}" @change="changTab">
				</u-tabs>
			</u-sticky>
			<!-- #endif -->
			
			<swiper style="height: 100vh;" current="swiperIndex" @animationfinish="animationfinish"
				@touchmove.stop.passive>
				<swiper-item>
					<article-item :uid="info.uid" :pageScroll="pageScroll"></article-item>
				</swiper-item>
				<swiper-item style="overflow: auto;">
					<article-item></article-item>
					123123
				</swiper-item>
				<swiper-item style="overflow: auto;">
					123123
					<article-item></article-item>
				</swiper-item>
			</swiper>
		</view>
	</z-paging>
</template>

<script>
	import articleItem from './components/articleItem.vue';
	export default {
		components: {
			articleItem
		},
		props: {
			nav: {
				type: Boolean,
				default: false
			},
			id: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				info: {},
				swiperIndex: 0,
				tabbarIndex: 0,
				tabs: [{
						name: '帖子'
					},
					{
						name: '动态'
					},
					{
						name: '评论'
					}
				],
				stopMove: false,
				opacity: 0,
				scrollTop: 0,
				pageScroll: true,
				elementHeight: 0,
				navbarHeight: 0,
			};
		},
		onLoad(params) {
			if (params) this.getAuthor(params.id)
		},
		created() {
			if (this.id) this.getAuthor(params.id)
		},
		onReady() {
			uni.createSelectorQuery().in(this).select('#profile').boundingClientRect(data => {
				
				this.elementHeight = data.bottom
			}).exec()
			
		},
		methods: {
			getAuthor(id) {
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: id
					}
				}).then(res => {
					console.log(res)
					if (res.statusCode == 200) {
						this.info = res.data.data
					}
				})
			},
			onRefresh() {
				console.log(1)
				setTimeout(() => {
					this.$refs.paging.complete();
				}, 1000)

			},
			changTab(data) {
				this.tabbarIndex = data.index
				this.swiperIndex = data.index
			},
			animationfinish(data) {
				this.swiperIndex = data.detail.current
				this.tabbarIndex = data.detail.current
			},
			scroll(data) {
				const scrollTop = data.detail.scrollTop;
				console.log(scrollTop, this.elementHeight)
				this.opacity = scrollTop / 200;
				if (scrollTop >= this.elementHeight) this.pageScroll = false
				else this.pageScroll = true
			},

		}
	}
</script>

<style lang="scss">

</style>