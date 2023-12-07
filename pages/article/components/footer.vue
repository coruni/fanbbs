<template>
	<view style="margin-top: 10rpx;">
		<view v-if="data.opt&&data.opt.files[0].link" style="margin-top: 20rpx;">
			<block v-for="(item,index) in data.opt.files" :key="index">
				<u-row justify="space-between" customStyle="margin-bottom:10rpx">
					<u-row customStyle="background: #f7f7f7;border-radius: 10rpx;height:60rpx;flex:1"
						@click="openUrl(item.link,'提取码',item.password)">
						<u-icon name="download" size="18"></u-icon>
						<text class="u-line-1">{{item.link}}</text>
					</u-row>
					<view v-if="item.unzipPass">
						<u-button plain
							customStyle="height:60rpx;width:auto;font-size:30rpx;border-radius:10rpx;margin-left:20rpx"
							color="#85a3ff" @click="copy(item.unzipPass,'解压码')">解压码</u-button>
					</view>
				</u-row>
			</block>
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