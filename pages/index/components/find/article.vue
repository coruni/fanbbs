<template>
	<view>
		<z-paging @query="getData" ref="paging" v-model="article">
			<block v-for="(item,index) in article" :key="index">
				<u-row customStyle="margin:0 30rpx 30rpx 30rpx" align="top">
					<view style="position: relative;">
						<u-avatar :src="item.userJson.avatar" size="30"></u-avatar>
						<image class="avatar_head" mode="aspectFill" :src="item.userJson.customize.head">
						</image>
					</view>

					<view style="margin-left: 20rpx;">
						<u-row>
							<text :style="{color: item.userJson.isvip ? '#a899e6' : ''}">{{item.userJson.name}}</text>
						</u-row>
						<text style="word-break: break-all;">{{item.text}}</text>
						<u-album :urls="item.pic.images" multipleSize="94" :borderRadius="10"
							customStyle="flex-wrap:nowrap"></u-album>
						<view style="margin-top: 20rpx;display: flex;flex-direction: column;">
							<block v-for="(tags,tabsindex) in item.pic.tags">
								<view>
									<text style="
										font-size: 28rpx;
										background:#a899e63c;
										color: #a899e6;
										padding:4rpx 14rpx;
										border-radius: 500rpx;
										">#{{tags.name}}</text>
								</view>
							</block>
							<u-row customStyle="
									font-size: 26rpx;
									color: #999;
									margin-top:10rpx
								" justify="space-between">
								<view>
									<text>{{$u.timeFormat(item.created, 'yyyy/mm/dd hh:MM')}}</text>
									<text style="margin-left: 40rpx;">{{item.likes}}点赞</text>
								</view>
								<view>
									<text style="color: #a899e6;font-size: 30rpx;"
										@click.stop="$emit('comments',item)">查看详情</text>
								</view>
							</u-row>
							<u-row justify="space-between">
								<u-icon name="share-square" size="24" @click="goShare(item)"></u-icon>
								<u-row>
									<u-icon name="chat" size="24"></u-icon>
									<text style="margin-left: 10rpx;">{{item.reply}}</text>
								</u-row>
								<u-icon name="thumb-up" size="24"></u-icon>
							</u-row>
						</view>
						<!-- <view style="background: #f7f7f7;border-radius: 10rpx;margin-top: 10rpx;">
							123123
						</view> -->
					</view>
				</u-row>
			</block>
		</z-paging>
	</view>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: 'all'
			}
		},
		data() {
			return {
				article: [],
				showComemnts: false,
				id: 0,
			}
		},
		methods: {
			getData(page, limit) {
				let params = {
					page,
					limit,
				}
				if (this.type == 'video') params.searchParams = JSON.stringify({
					type: 4
				})
				this.$http.get('/typechoSpace/spaceList', {
					params
				}).then(res => {
					let list = [];
					if (res.data.code) {
						for (let i in res.data.data) {
							let data = res.data.data[i]
							data.pic = JSON.parse(data.pic)
							data.userJson.customize = JSON.parse(data.userJson.customize)
							list.push(data)
						}
						this.$refs.paging.complete(list)
					}
				})
			},
			goShare(data) {
				console.log('getData')
			}
		}
	}
</script>

<style>
</style>