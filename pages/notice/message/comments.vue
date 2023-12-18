<template>
	<view>
		<u-loading-page :loading="loading"></u-loading-page>
		<z-paging ref="paging" v-model="comments" @query="getData" :refresher-enabled="false" v-show="!loading">

			<template #top>
				<u-navbar bgColor="transparent" title="评论" placeholder autoBack>
					<view slot="left">
						<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
			</template>
			<block v-for="(item,index) in comments">
				<view style="margin:30rpx;background: #fff;border-radius: 20rpx;padding: 30rpx;"
					@click="goArticle(item)">
					<u-row customStyle="margin-bottom:20rpx">
						<u-avatar :src="item.userJson.avatar" size="24"></u-avatar>
						<text style="margin-left:20rpx;font-weight: 600;">{{item.userJson.name}}</text>
					</u-row>
					<u-parse class="u-line-2" :content="formatEmoji(item.text)"></u-parse>
					<view style="border-left: #f7f7f7 6rpx solid;padding-left: 10rpx;margin: 10rpx 0;">
						<text style="color: #999;font-size: 28rpx;">{{item.contenTitle}}</text>
					</view>
					<u-row justify="space-between" customStyle="color:#999;font-size:26rpx">
						<text>{{$u.timeFormat(item.created,'mm-dd')}}</text>
						<u-row customStyle="color:#85a3ff">
							<text>查看</text>
							<u-icon name="arrow-right" size="14" color="#85a3ff"></u-icon>
						</u-row>
					</u-row>
				</view>
			</block>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				comments: [],
				loading: true,
			}
		},
		onShow() {
			this.clearNotice()
		},
		methods: {
			getData(page, limit) {
				this.$http.post('/user/inbox', {
					page,
					limit,
					type: 'comment'
				}).then(res => {
					console.log(res)
					this.$refs.paging.complete(res.data.data)
					setTimeout(() => {
						this.loading = false
					}, 500)
				})
			},
			formatEmoji(html) {
				return html.replace(/\[([^\]]+)_([^\]]+)\]/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name);
					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`;
						return `<img src=".${src}" style="width:80rpx;height:80rpx">`;
					}
					// 如果找不到对应的 emoji，可能需要返回原始的字符串或者给出一些提示
					return match;
				})
			},
			goArticle(data) {
				console.log(data)
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data.contentsInfo.cid
					}
				})
			},
			clearNotice() {
				this.$http.post('/user/setRead', {
					type: 'comment'
				}).then(res => {
					console.log(res.data.msg)
				})
			}
		}
	}
</script>

<style>
	page {
		background: #85a3ff0a;
	}
</style>