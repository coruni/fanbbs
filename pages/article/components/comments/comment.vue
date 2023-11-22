<template>
	<view>
		<u-row align="top">
			<u-avatar :src="data.avatar" size="30" customStyle="border:4rpx solid #85a3ff32"></u-avatar>
			<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
				<u-row align="center">
					<text
						:style="{color:data.isvip?'#a899e6':'',fontSize:30+'rpx',fontWeight:600}">{{data.author}}</text>
					<text
						style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
						v-if="data.authorId == article.authorId">作者</text>
				</u-row>
				<view style="margin-top:10rpx;word-break: break-word;" @click="reply(data)">
					<u-parse :content="data.text"></u-parse>
				</view>
				<u-grid :col="3" :border="false" v-if="data.longtext && data.longtext.images">
					<u-grid-item v-for="(image,imageIndex) in data.longtext.images" :key="imageIndex"
						v-if="imageIndex<9" @click.native.stop="preview"
						:customStyle="{width:'210rpx',height:'210rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:'10rpx'}">
						<image :src="image" mode="aspectFill" style="width:210rpx;height:210rpx;border-radius:10rpx"
							class="u-info-light-bg"></image>
					</u-grid-item>
				</u-grid>
				<view style="margin-top: 10rpx;" v-if="data.sonComments.data&&data.sonComments.data.length"
					@click="goSubComment(data)">
					<block v-for="(item,index) in data.sonComments.data" :key="index" v-if="index<2">
						<u-row
							customStyle="border-left:6rpx solid #85a3ff14;padding-left:15rpx;flex-direction:column;padding-bottom:5rpx"
							align="top">
							<u-row>
								<u-row>
									<u-avatar :src="item.avatar" size="20"></u-avatar>
									<text style="margin-left: 10rpx;font-size: 30rpx;font-weight: 600;"
										:style="{color:data.isvip?'#a899e6':''}">{{item.author}}</text>
								</u-row>
								<text
									style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
									v-if="item.authorId == article.authorId">作者</text>
							</u-row>
							<view>
								<text style="font-size: 30rpx;color: #454545;">{{item.text}}</text>
							</view>
						</u-row>
					</block>
					<view style="margin-top: 30rpx;">
						<view
							style="padding:8rpx 20rpx;font-size: 26rpx;background:#85a3ff14;font;display: flex;align-items: center;width: 180rpx;border-radius: 500rpx;justify-content: space-around;">
							<text>{{data.sonComments.count}}条评论</text>
							<u-icon name="arrow-right" size="13"></u-icon>
						</view>

					</view>
				</view>
				<u-gap height="6"></u-gap>
				<view style="padding-bottom: 50rpx;">
					<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
						<text>{{$u.timeFormat(data.created,'mm-dd')}}</text>
						<u-row customStyle="flex-basis:30%" justify="space-between">
							<u-icon name="chat" color="#aaa" label="回复" size="20" labelColor="#aaa"
								label-size="12"></u-icon>
							<u-icon name="thumb-up" color="#aaa" :label="data.likes?data.likes:''" size="20"
								labelColor="#aaa" label-size="12"></u-icon>
						</u-row>
					</u-row>
				</view>
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
			},
			article: {
				type: Object,
				default: null,
			}
		},
		name: 'comment',
		data() {
			return {
				comments: [],
				num: 0,
			}
		},
		created() {

		},
		methods: {
			getComments() {
				this.$http.get('/typechoComments/commentsList', {
					params: {
						page: 1,
						limit: 2,
						searchParams: JSON.stringify({
							type: 'comment',
							cid: this.data.cid,
							allparent: this.data.coid,
						}),
						order: 'created asc'
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.comments = res.data.data
						this.num = res.data.count
					}
				})
			},
			reply(data) {
				this.$emit('reply', data)
			},
			goSubComment(data) {
				uni.setStorageSync('subComment_' + data.coid, data)
				this.$Router.push({
					path: '/pages/article/components/comments/subComment',
					query: {
						id: data.coid
					}
				})
			},
			goProfile(data) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id: data.authorId
					}
				})
			}
		}
	}
</script>

<style>
</style>