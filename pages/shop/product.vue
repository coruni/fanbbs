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
				<u-button color="#85a3ff" shape="circle" style="box-shadow: 0 0 4px 0 #85a3ff;">购买</u-button>
			</view>
		</view>
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