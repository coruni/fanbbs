<template>
	<view>
		<z-paging @query="key && getData" ref="paging" v-model="article" :refresher-enabled="false">
			<view style="margin: 30rpx;">
				<text>相关帖子</text>
			</view>
			<block v-for="(item,index) in article" :key="index">
				<view style="margin: 30rpx;padding: 30rpx;background:#fff;border-radius: 20rpx;" @click="goArticle(item)">
					<view style="display: flex;flex-direction: column;">
						<u-row justify="space-between" align="top">
							<view class="u-line-2" style="display: flex;flex-direction: column;">
								<text style="font-size: 36rpx;font-weight: 600;">{{item.title}}</text>
								<text class="u-line-1">{{item.text}}</text>
							</view>
							<image v-if="item.images&&item.images[0]"
								:src="item.images&& item.images[0]?item.images[0]:'/static/login.png'"
								style="width: 260rpx;height: 160rpx; border-radius: 20rpx;flex-shrink: 0;"
								mode="aspectFill"></image>
						</u-row>
						<u-row justify="space-between" style="margin-top: 20rpx;">
							<u-avatar :src="item.authorInfo.avatar" size="24"></u-avatar>
							<u-icon name="eye-fill" size="16" labelColor="#eee" color="#eee"
								:label="item.views"></u-icon>
						</u-row>
					</view>
				</view>
			</block>
			<template #loadingMoreNoMore></template>
		</z-paging>
	</view>
</template>

<script>
	export default {
		name: 'allArticle',
		props: {
			search: {
				type: String,
				default: null,
			}
		},
		watch: {
			search: {
				handler(e) {
					this.key = e
					this.getData()
				},
				immediate: true,
				deep: true
			}
		},
		data() {
			return {
				key: null,
				article: [],
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/typechoContents/contentsList', {
					params: {
						page,
						limit,
						searchKey: this.key
					}
				}).then(res => {
					console.log(res)
					this.$refs.paging.complete(res.data.data)
				})
			},
			goArticle(data) {
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data.cid
					}
				})
			}
		}
	}
</script>

<style>
</style>