<template>
	<view style="margin-top: 10rpx;">
		<view v-if="data.opt&&data.opt.files[0].link" style="margin-top: 20rpx;">

			<view style="margin-top: 10rpx;background: #f7f7f7;border-radius: 20rpx;padding: 20rpx;">
				<view style="margin-bottom: 10rpx;">
					<i class="ess icon-download_line" style="color: #85a3ff;font-size: 34rpx;"></i>
					<text style="font-weight: 600;margin-left: 10rpx;">资源下载</text>
				</view>
				<view style="display: flex;flex-direction: column;">
					<block v-for="(item,index) in data.opt.files">
						<u-row>
							<u-button shape="circle">
								<u-row>
									<i class="ess icon-download_3_line"></i>
									<text>{{item.name?item.name:`资源${index+1}`}}</text>
								</u-row>
							</u-button>
							<u-row style="margin-left: 20rpx;">
								<view>
									<u-button shape="circle" @click="copy(item.password,'提取码')">提取码</u-button>
								</view>
								<view>
									<u-button shape="circle" style="margin-left: 10rpx;" @click="copy(item.unzipPass,'解压密码')">解压密码</u-button>
								</view>
							</u-row>
						</u-row>
						
					</block>
				</view>
			</view>
		</view>
		<u-row customStyle="margin-top: 20rpx;flex-wrap:wrap;">
			<u-row v-if="data &&data.category && data.category.length">
				<view @click.stop="goCategory(data.category[0].mid)" style="border-radius: 10rpx;
					padding: 8rpx 20rpx ;
					text-align: center;
					font-size: 14px;
					background:#85a3ff1e;
					margin-right: 10rpx;
					margin-top: 10rpx;
					color: #85a3ff; ">
					<text>{{data.category[0].name}}</text>
				</view>
			</u-row>
			<view v-if="data.tag.length>0" style="display: flex;">
				<block v-for="(item,index) in data.tag" :key="index">
					<view style="
						font-size: 26rpx;
						background:#85a3ff1e;
						color: #85a3ff;
						padding:8rpx 14rpx;
						border-radius: 500rpx;
						margin-right: 10rpx;
						margin-top: 10rpx;
						font-size: 26rpx;
						">
						<i class="ess icon-hashtag_line" style="font-size: 26rpx;"></i>
						<text>{{item.name}}</text>
					</view>
				</block>
			</view>
		</u-row>

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
				setTimeout(() => {
					plus.runtime.openURL(url)
				}, 500)
				if (data) {
					this.copy(data, name)
				}
			},
			copy(data, name) {
				if(!data){
					uni.$u.toast(name+'暂时没有')
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
			goCategory(id) {
				this.$Router.push({
					path: '/pages/common/category/categoryInfo',
					query: {
						id
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>