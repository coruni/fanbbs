<template>
	<view>
		<u-row justify="space-between">
			<u-row>
				<view style="position: relative;" @tap.stop.prevent="goProfile(data.authorId)">
					<u-avatar :src="data.authorInfo && data.authorInfo.avatar" :size="34"
						customStyle="border:4rpx solid #85a3ff32"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data.authorInfo && data.authorInfo.opt && data.authorInfo.opt.head_picture">
					</image>
				</view>
				<view style="display: flex;flex-direction: column;margin-left:20rpx;">
					<u-row>
						<text style="font-size: 30rpx;font-weight: 600;"
							:class="{'vipname':data&& data.authorInfo && data.authorInfo.isVip}">{{data.authorInfo.screenName?data.authorInfo.screenName:data.authorInfo.name}}</text>
						<text
							:style="{border:`${data.authorInfo.level > 8 ? $level[Math.floor(data.authorInfo.level/2)-1] : $level[data.authorInfo.level-1]} solid 2rpx`,background:data.authorInfo.level > 8 ? $level[Math.floor(data.authorInfo.level/2)-1] : $level[data.authorInfo.level-1] }"
							style="font-size: 18rpx;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx;color: white;"
							v-if="data.authorInfo.level">
							Lv.{{data.authorInfo.level}}
						</text>
					</u-row>
					<u-row style="font-size: 24rpx;color: #999;">
						<text>{{$u.timeFrom(data.created,'mm-dd')}}</text>
						<text style="margin-left: 30rpx;">{{data.category && data.category.name}}</text>
					</u-row>
				</view>
			</u-row>
			<view style="display: flex;align-items: center;">
				<view @click.stop="follow(data.authorInfo.uid)">
					<u-button v-if="!isfollow && data && data.authorInfo.uid !== userInfo.uid" plain color="#ff0800"
						size="mini" shape="circle" plain customStyle="font-size:28rpx;height:55rpx;background:tran"
						@click="$emit('follow',true)">关注</u-button>
				</view>
				<view>
					<i class="ess mgc_more_1_line" style="font-size: 60rpx;margin-left: 10rpx;"
						@click.stop="$emit('menuTap',data)"></i>
				</view>
			</view>
		</u-row>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			data: {
				type: Object,
				default: null,
			}
		},
		data() {
			return {
				isfollow: false
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		created() {
			this.isfollow = this.data.authorInfo.isFollow
		},
		methods: {
			goArticle(data) {
				uni.setStorageSync(`article_${data.cid}`, data)
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data.cid
					}
				})
			},
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			},
			follow(id) {
				if (this.userInfo.uid == id) return;
				this.$http.post('/user/follow', {
					id
				}).then(res => {
					if (res.data.code == 200) {
						uni.$u.toast(res.data.msg)
						this.isfollow = !this.isfollow
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

	.u-button--plain {
		background: transparent;
	}
</style>