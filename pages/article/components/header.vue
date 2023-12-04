<template>
	<view>
		<text style="font-size: 50rpx;font-weight: 600;">{{data &&data.title}}</text>
		<u-row customStyle="color:#c0c4cc">
			<u-icon name="clock" size="13" color="#c0c4cc" labelSize="13"
				:label="$u.timeFrom(data.created,'mm-dd')"></u-icon>
			<text style="margin:0 20rpx">·</text>
			<u-icon name="eye-fill" size="13" color="#c0c4cc" labelSize="13" :label="data.views"></u-icon>
		</u-row>

		<u-row justify="space-between"
			style="background: #85a3ff0a;padding: 40rpx 35rpx;border-radius: 20rpx;margin-top: 20rpx;">
			<u-row @click="goProfile(data.authorId)">
				<view style="position: relative;display: inline-block;">
					<u-avatar :src="data && data.authorInfo&& data.authorInfo.avatar" size="40"
						customStyle="border:4rpx solid #85a3ff32"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data && data.authorInfo && data.authorInfo.opt  && data.authorInfo.opt.head_picture">
					</image>
				</view>
				<view style="display: flex;flex-direction: column;margin-left:20rpx;font-size: 30rpx;">
					<u-row>
						<text style="font-weight: 600;">{{data && data.authorInfo && data.authorInfo.name}}</text>
						<i v-if="data.authorInfo.level" :class="`level icon-lv-${data.authorInfo.level}`"
							style="font-size: 50rpx; margin-left: 10rpx;"
							:style="{ color: data.authorInfo.level > 8 ? $level[Math.floor(data.authorInfo.level/2)-1] : $level[data.authorInfo.level-1] }">
						</i>
					</u-row>
					<text class="u-info u-line-1"
						style="font-size: 28rpx;">{{data && data.authorInfo && data.authorInfo.introduce}}</text>
				</view>
			</u-row>
			<view>
				<u-button :plain="data && data.authorInfo&& !data.authorInfo.isfollow" shape="circle"
					hover-class="button_hover"
					:color="data && data.authorInfo&& data.authorInfo.isfollow?'#85a3ff0f':'#85a3ff'"
					customStyle="width:160rpx;height:60rpx"
					:style="{color:data && data.authorInfo&& data.authorInfo.isfollow?'black':'#85a3ff'}"
					:text="data && data.authorInfo&& data.authorInfo.isfollow?'已关注':'关注'"
					@click="$emit('follow',data.authorId)"></u-button>
			</view>
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
		methods: {
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.u-button::before {
		background: $c-primary;
	}
</style>