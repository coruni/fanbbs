<template>
	<view>
		<z-paging refresher-only @onRefresh="onRefresh" ref="paging" style="background: #faead7;">
			<template #top>
				<u-navbar autoBack bgColor="transparent"></u-navbar>
			</template>
			<view class="info">
				<image :src="info.imgurl" mode="aspectFill" style="width: 100%;height: 550rpx;"></image>
				<view style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #faead778;">
					<view class="info_lay"
						style="background: linear-gradient(to top, #faead79d 20%, rgba(0, 0, 0, 0) 70%);">
						<view style="margin:30rpx;margin-bottom: 60rpx;">
							<u-row>
								<u-avatar :src="info.imgurl" size="70" shape="square" mode="aspectFill"></u-avatar>
								<view style="display: flex;flex-direction: column;margin-left: 30rpx;">
									<text style="font-size: 36rpx;color: white;">{{info.name}}</text>
									<text>占位123</text>
								</view>
							</u-row>
							<view style="margin-top: 30rpx;">
								<text>{{info.description}}</text>
							</view>
							<view style="margin-top: 30rpx;">
								<u-button shape="circle" color="#faead7">加入</u-button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view style="position: relative;top: -30rpx;background: #faead7;border-radius: 40rpx 40rpx 0 0;">
				<u-sticky bgColor="#faead7">
					<u-tabs :list="list" style="margin: 0 15rpx;" lineColor="#dccebf"></u-tabs>
				</u-sticky>
				<swiper style="height: 100vh;">
					<swiper-item v-for="(item,index) in list" :key="index">
						{{info}}
					</swiper-item>
				</swiper>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				info: {},
				list: [{
						name: '热门'

					},
					{
						name: '最新'
					}
				]
			};
		},
		onLoad(params) {
			this.getData(params.id)
		},
		methods: {
			getData(id) {
				this.$http.get('/typechoMetas/metaInfo', {
					params: {
						key: id
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.info = res.data.data
					}
				})
			},
			onRefresh() {
				setTimeout(() => {
					this.$refs.paging.complete()
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	.info {
		position: relative;
		top: 0;
		height: 550rpx;

		&_lay {
			position: absolute;
			bottom: 0;
			width: 100%;
		}
	}
</style>