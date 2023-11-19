<template>
	<view style="margin-top: 10rpx;">
		<u-row justify="space-between">
			<u-row>
				<view>
					<text
						style="border-radius: 10rpx;padding: 8rpx 20rpx ;text-align: center;font-size: 14px;background-color: rgba(168,153,230,0.1);color: #a899e6; "
						v-if="data.category.length>0">{{data.category[0].name}}</text>
				</view>
				<block v-for="(tag,index) in data.tag" :key="index" v-if="data.tag">
					<view>
						<text
							style="border-radius: 10rpx;padding:8rpx 8rpx;text-align: center;font-size: 14px;">#{{tag.name}}</text>
					</view>
				</block>
			</u-row>
		</u-row>
		<view>
			<block v-for="(item,index) in data.opt.files" :key="index">
				<u-row justify="space-between">
					<u-col span="7">
						<u-row customStyle="background: #f7f7f7;border-radius: 10rpx;padding: 7rpx;">
							<u-icon name="download" size="18"></u-icon>
							<text>{{item.link}}</text>
						</u-row>
					</u-col>
					<view>
						<text
							style="background: #f7f7f7;font-size: 30rpx;'border-radius: 10rpx;padding: 10rpx;">提取码</text>
						<text
							style="background: #f7f7f7;font-size: 30rpx;border-radius: 10rpx;padding: 10rpx;margin-left: 10rpx;">解压码</text>
					</view>


				</u-row>
			</block>
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
		}
	}
</script>

<style lang="scss">

</style>