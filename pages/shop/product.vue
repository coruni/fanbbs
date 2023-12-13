<template>
	<view>
		<u-navbar title="商品详情" placeholder autoBack>
			<view slot="left">
				<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="right">
				<i class="ess icon-share_3_line" style="font-size: 45rpx;"></i>
			</view>

		</u-navbar>
		<view style="position: relative;top: 0;">
			<u-swiper height="280" :list="info && info.imgurl" radius="0" circular @click="swiperTap"
				@change="swiperIndex = $event.current"></u-swiper>
			<view
				style="font-size: 24rpx;background: #85a3ffa0;border-radius:20rpx 0rpx 0rpx 0 ;padding:6rpx 20rpx;position: absolute;bottom: 0;right: 0;"
				v-if="info.imgurl && info.imgurl.length">
				<text style="color: #fff;">{{swiperIndex+1}}/{{info.imgurl&&info.imgurl.length}}</text>
			</view>
		</view>
		<view style="margin: 30rpx;">
			<view style="display: flex;align-items: baseline;color: red;">
				<i class="ess icon-coin_line" style="font-size: 26rpx;margin-right: 10rpx;"></i>
				<text style="font-size: 40rpx;">{{info.price}}</text>
			</view>
			<text style="font-weight: 600;">{{info.title}}</text>
			<view style="font-size: 24rpx;color: #999;">
				<text>已售 {{info.sellNum}}</text>
			</view>
			<!-- 规格 -->
			<view style="margin-top: 20rpx;
			background: #f7f7f7;
			border-radius: 20rpx;
			padding: 20rpx 30rpx;">
				<view>
					<text style="
					font-size: 28rpx;
					color: #999;">选择规格</text>
				</view>
				<u-row customStyle="
				margin-top: 20rpx;
				flex-wrap: wrap;">
					<block v-for="(item,index) in info.specs" :key="index">
						<view style="
									font-size: 28rpx;
									border-radius: 50rpx;
									padding: 8rpx 30rpx;
									background: #fff;
									margin-right: 20rpx;
									margin-bottom: 10rpx;
									" :style="[selectSpecs.id==item.id ? {background:'#85a3ffc3', color:'#fff'} : {}]"
							@tap.stop="selectSpecs = item">
							<text>{{item.name}}</text>
						</view>
					</block>
				</u-row>
			</view>
			<view style="margin-top: 20rpx;">
				<u-row justify="space-between" style="flex-wrap: nowrap;">
					<u-col span="6">
						<u-row>
							<u-avatar :src="info.bossInfo&& info.bossInfo.avatar" size="36"></u-avatar>
							<text style="margin-left: 20rpx;font-weight: 600;font-size: 28rpx;"
								class="u-line-1">{{info.bossInfo&&info.bossInfo.screenName}}</text>
						</u-row>
					</u-col>
					<u-col span="6">
						<u-row>
							<u-button shape="circle" plain customStyle="height:60rpx;width:200rpx">关注</u-button>
							<u-button shape="circle" color="#85a3ff"
								customStyle="height:60rpx;margin-left:20rpx">更多商品</u-button>
						</u-row>
					</u-col>

				</u-row>
			</view>
			<view style="margin-top: 50rpx;">
				<text style="font-weight: 600;">商品详情</text>
				<uv-parse :showImgMenu="false" :content="info.text"></uv-parse>
			</view>
		</view>
		<view style="position: fixed;bottom: 0;width: 100%;background: #fff;">
			<view style="padding: 20rpx 30rpx;">
				<u-button color="#85a3ff" shape="circle" style="box-shadow: 0 0 4px 0 #85a3ff;"
					@click="showSpecs = true">购买</u-button>
			</view>
		</view>
		<u-popup :show="showSpecs" @close="showSpecs= false" closeable round="10">
			<view style="text-align: center;margin-top: 30rpx;">
				<text>选择商品规格</text>
			</view>
			<view style="margin: 30rpx;">
				<u-row>
					<image :src="selectSpecs && selectSpecs.image" mode="aspectFill"
						style="height: 120rpx;width: 120rpx;border-radius: 20rpx;background: #f7f7f7;"></image>
					<view style="display: flex;flex-direction: column;margin-left: 20rpx;">
						<text>已选：{{selectSpecs && selectSpecs.name}}</text>
						<u-row align="baseline" style="color: red;">
							<i class="ess icon-coin_line"></i>
							<text style="margin-left: 10rpx;">{{selectSpecs&&selectSpecs.price}}</text>
						</u-row>
					</view>
				</u-row>
				<view style="margin-top: 20rpx;
				background: #f7f7f7;
				border-radius: 20rpx;
				padding: 20rpx 30rpx;">
					<view>
						<text style="
						font-size: 28rpx;
						color: #999;">选择规格</text>
					</view>
					<u-row customStyle="
					margin-top: 20rpx;
					flex-wrap: wrap;">
						<block v-for="(item,index) in info.specs" :key="index">
							<view style="
										font-size: 28rpx;
										border-radius: 50rpx;
										padding: 8rpx 30rpx;
										background: #fff;
										margin-right: 20rpx;
										margin-bottom: 10rpx;
										" :style="[selectSpecs.id==item.id ? {background:'#85a3ffc3', color:'#fff'} : {}]"
								@tap.stop="selectSpecs = item">
								<text>{{item.name}}</text>
							</view>
						</block>
					</u-row>
				</view>
				<view style="margin-top: 60rpx;">
					<u-button color="#85a3ff" shape="circle">立即购买</u-button>
				</view>
			</view>
		</u-popup>
		<!-- fixed占位 -->
		<u-gap height="50"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				info: {},
				swiperIndex: 0,
				selectSpecs: {},
				showSpecs: false,
				showBuy: false,
			};
		},
		onLoad(params) {
			this.getData(params.id)
		},
		methods: {
			getData(id) {
				this.$http.get('/typechoShop/shopInfo', {
					params: {
						key: id,
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}
				}).then(res => {
					console.log(res)
					if (res.statusCode == 200) {
						this.info = res.data
						console.log(this.info)
					}
				})
			},
			swiperTap(index) {
				uni.previewImage({
					urls: this.info.imgurl,
					current: index
				})
			}
		}
	}
</script>

<style lang="scss">

</style>