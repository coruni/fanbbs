<template>
	<view style="margin-top: 10rpx;">
		<view v-if="data.opt&&data.opt.files[0].link" style="margin-top: 20rpx;">
			<view class="download-content">
				<view style="margin-bottom: 10rpx;">
					<i class="ess mgc_download_line" style="color: #ff0800;font-size: 34rpx;"></i>
					<text style="font-weight: 600;margin-left: 10rpx;">资源下载</text>
				</view>
				<view style="display: flex;flex-direction: column;">
					<block v-for="(item,index) in data.opt.files">
						<view style="margin-bottom: 20rpx;">
							<u-row>
								<u-button shape="circle" @click="openUrl(item.link)">
									<u-row>
										<i class="ess mgc_download_3_line"></i>
										<text>{{item.name?item.name:`资源${index+1}`}}</text>
									</u-row>
								</u-button>
								<u-row style="margin-left: 20rpx;">
									<view v-if="item.password">
										<u-button shape="circle" @click="copy(item.password,'提取码')">提取码</u-button>
									</view>
									<view v-if="item.unzipPass">
										<u-button shape="circle" style="margin-left: 10rpx;"
											@click="copy(item.unzipPass,'解压码')">解密码</u-button>
									</view>
								</u-row>
							</u-row>
						</view>

					</block>
				</view>
			</view>
		</view>
		<block v-if="data.isHide">
			<view style="border-radius: 20rpx;border: #ff8800 1rpx dotted;text-align: center;padding: 30rpx;"
				@click="$emit('hideFilesTap',true)">
				<text style="color: #ff8800;">有隐藏的文件，请支付后查看</text>
			</view>
		</block>
		<view style="margin-top: 20rpx;">
			<u-row style="flex-wrap:wrap;">
				<block v-for="(item,index) in data.tag" :key="index">
					<view style="
						font-size: 26rpx;
						background:#ff08001e;
						color: #ff0800;
						padding:8rpx 14rpx;
						border-radius: 500rpx;
						margin-right: 10rpx;
						margin-top: 10rpx;
						font-size: 26rpx;
						">
						<i class="ess mgc_hashtag_line" style="font-size: 26rpx;"></i>
						<text>{{item.name}}</text>
					</view>
				</block>
			</u-row>
		</view>

	</view>
</template>

<script>
	export default {
		name: 'articleFooter',
		props: {
			data: {
				type: Object,
				default: null,

			}
		},
		data() {
			return {

			}
		},
		created() {

		},
		methods: {
			openUrl(url, name, data) {
				// #ifdef APP
				plus.runtime.openWeb(url)
				// #endif
				// #ifndef APP
				window.open(url)
				// #endif
				if (data) {
					this.copy(data, name)
				}
			},
			copy(data, name) {
				if (!data) {
					uni.$u.toast(name + '暂时没有')
					return;
				}
				uni.setClipboardData({
					data: data,
					showToast: false,
					success: (res) => {
						uni.$u.toast(name + '已复制')
					}
				})
			},

		}
	}
</script>

<style lang="scss">
	.download-content {
		margin-top: 10rpx;
		background: #f7f7f7;
		border-radius: 20rpx;
		padding: 20rpx;
	}
</style>