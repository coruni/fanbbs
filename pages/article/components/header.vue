<template>
	<view>
		<u-row justify="space-between">
			<u-row>
				<u-avatar :src="data.authorInfo.avatar" size="30"></u-avatar>
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