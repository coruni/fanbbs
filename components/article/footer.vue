<template>
	<view style="margin-top: 20rpx;">
		<u-row justify="space-between">
			<u-row v-if="!waterFall">
				<view v-if="data.tag.length>0">
					<text style="
						font-size: 30rpx;
						background:#ffa3853c;
						color: #ffa385;
						padding:8rpx 14rpx;
						border-radius: 500rpx;
						">#{{data.tag[0].name}}</text>
				</view>
			</u-row>
			<view v-else style="position: relative;top: 0;">
				<u-avatar :src="data.authorInfo.avatar" size="26" ></u-avatar>
				
			</view>
			
			<u-row>
				<u-icon name="thumb-up" size="24" color="#999"></u-icon>
				<text style="color: #999;">{{data.likes}}</text>
			</u-row>
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
			},
			waterFall: {
				type: [String, Boolean],
				default: false,
			}
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss">
	.category {
		background: rgba($c-primary, 0.1);
		color: $c-primary;
	}

	.primary {
		color: $c-primary;
	}
</style>