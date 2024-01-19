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
							:class="{'vipname':data&& data.authorInfo && data.authorInfo.isvip}">{{data.authorInfo.screenName?data.authorInfo.screenName:data.authorInfo.name}}</text>
						<i v-if="data.authorInfo.level" :class="`level icon-lv-${data.authorInfo.level}`"
							style="font-size: 50rpx; margin-left: 10rpx;"
							:style="{ color: data.authorInfo.level > 8 ? $level[Math.floor(data.authorInfo.level/2)-1] : $level[data.authorInfo.level-1] }">
						</i>
					</u-row>
					<u-row style="font-size: 20rpx;color: #999;">
						<text>{{$u.timeFrom(data.created,'mm-dd')}}</text>
						<text style="margin-left: 30rpx;">{{data.category.name}}</text>
					</u-row>
				</view>
			</u-row>
			<view style="display: flex;align-items: center;">
				<view @click.stop="follow(data.authorInfo.uid)">
					<u-button v-if="!isfollow && data && data.authorInfo.uid !== userInfo.uid" plain color="#85a3ff" size="mini"
						shape="circle" plain customStyle="font-size:28rpx;height:55rpx;background:tran" @click="$emit('follow',true)">关注</u-button>
				</view>
				<view>
					<i class="ess icon-more_1_line" style="font-size: 60rpx;margin-left: 10rpx;" @click.stop="$emit('menuTap',data)"></i>
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
					if (res.data.code==200) {
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
	.u-button--plain{
		background: transparent;
	}
</style>