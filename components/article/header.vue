<template>
	<view>
		<u-row justify="space-between">
			<u-row>
				<view @tap.stop.prevent="goProfile(data.authorId)">
					<u-avatar :src="data.authorInfo.avatar" size="30"></u-avatar>
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
			goArticle(data) {
				uni.setStorageSync(`article_${data.cid}`, data)
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data.cid
					}
				})
			},
			goProfile(id){
				this.$Router.push({
					path:'/pages/profile/profile',
					query:{
						id
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