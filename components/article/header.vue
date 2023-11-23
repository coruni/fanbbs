<template>
	<view>
		<u-row justify="space-between">
			<u-row>
				<view style="position: relative;" @tap.stop.prevent="goProfile(data.authorId)">
					<u-avatar :src="data.authorInfo.avatar" size="34"
						customStyle="border:4rpx solid #85a3ff32"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data.authorInfo.opt && data.authorInfo.opt.headStatus && data.authorInfo.opt.head_picture">
					</image>
				</view>
				<view style="display: flex;flex-direction: column;margin-left:20rpx">
					<text style="font-size: 30rpx;font-weight: 600;"
						:class="{'vipname':data.authorInfo.isvip}">{{data.authorInfo.name}}</text>
					<text style="font-size: 26rpx;color: #999;">{{$u.timeFormat(data.created,'mm-dd')}}</text>
				</view>
			</u-row>

			<view style="display: flex;align-items: center;">
				<view  @click.stop="follow()">
					<u-button v-if="!isfollow && data.authorId != userInfo.uid" plain color="#a899e6" size="mini"
						shape="circle" customStyle="font-size:28rpx;height:50rpx">关注</u-button>
				</view>
				<view @click.stop="">
					<u-icon name="more-dot-fill" size="20" customStyle="margin-left:30rpx" ></u-icon>
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
			this.isfollow = this.data.authorInfo.isfollow
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
			follow() {
				if(this.userInfo.uid == this.data.authorId) return;
				this.$http.post('/typechoUsers/follow', {
					toid: this.data.authorId
				}).then(res => {
					if (res.data.code) {
						uni.$u.toast(res.data.msg)
						this.isfollow = !this.isfollow
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.vipname {
		color: $c-primary;
	}
</style>