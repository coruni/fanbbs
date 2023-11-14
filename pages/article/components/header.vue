<template>
	<view>
		<u-row justify="space-between">
			<u-row>
				<view style="position: relative;">
					<u-avatar :src="data.authorInfo.avatar" size="30"></u-avatar>
					<image class="avatar_head" mode="aspectFill" :src="data.authorInfo.customize.head">
					</image>
				</view>
				
				<text style="margin-left:20rpx"
					:class="{'vipname':data.authorInfo.isvip}">{{data.authorInfo.name}}</text>
			</u-row>
		</u-row>
	</view>
</template>

<script>
	export default {
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
		methods:{
			
		}
	}
</script>

<style lang="scss">
	.vipname {
		color: $c-primary;
	}
</style>