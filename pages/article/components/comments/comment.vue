<template>
	<view>
		<u-row align="top">
			<u-avatar :src="data.avatar" size="30"></u-avatar>
			<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
				<u-row justify="space-between">
					<text :style="{color:data.isvip?'#FB7299':''}">{{data.author}}</text>

				</u-row>
				<view style="margin-top:10rpx;word-break: break-word;" @tap.stop.prevent="reply(data)">
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
				<view style="background: #f7f7f7;padding:10rpx;border-radius: 10rpx;" v-if="comments.length>0"
					@click="subComment">
					<block v-for="(item,index) in comments" :key="index">
						<u-row align="top" customStyle="font-size:30rpx">
							<text style="color: #69d0ff;flex-shrink: 0;">{{item.author}}</text>
							<text style="margin-left: 5rpx;">：</text>
							<text class="u-line-2">{{item.text}}</text>
						</u-row>
					</block>
					<u-row>
						<text style="color: #aaa;font-size: 30rpx;">查看{{num}}条评论</text>
						<u-icon name="arrow-right" size="14"></u-icon>
					</u-row>
				</view>
				<u-gap height="6"></u-gap>
				<view style="border-bottom:2rpx solid #f7f7f7;padding-bottom: 20rpx;">
					<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
						<text>{{data.created | date}}</text>
						<u-row customStyle="flex-basis:40%" justify="space-between">
							<u-icon name="chat" color="#aaa" label="回复" size="20" labelColor="#aaa"
								label-size="12"></u-icon>
							<u-icon name="thumb-up" color="#aaa" :label="1" size="20" labelColor="#aaa"
								label-size="12"></u-icon>
							<u-icon name="thumb-down" color="#aaa" size="20" labelColor="#aaa" label-size="12"></u-icon>
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
			this.getComments()
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
							parent: this.data.coid,
						})
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
			subComment() {
				this.$emit('subComment', this.data)
			}
		}
	}
</script>

<style>
</style>