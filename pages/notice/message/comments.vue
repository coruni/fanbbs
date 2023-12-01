<template>
	<view>
		<u-loading-page :loading="loading"></u-loading-page>
		<z-paging ref="paging" v-model="comments" @query="getData" :refresher-enabled="false" v-show="!loading">
			
			<template #top>
				<u-navbar bgColor="transparent" title="评论" placeholder autoBack></u-navbar>
			</template>
			<block v-for="(item,index) in comments">
				<view style="margin:30rpx;background: #fff;border-radius: 20rpx;padding: 30rpx;"
					@click="goArticle(item)">
					<u-row customStyle="margin-bottom:20rpx">
						<u-avatar :src="item.userJson.avatar" size="24"></u-avatar>
						<text style="margin-left:20rpx;font-weight: 600;">{{item.userJson.name}}</text>
					</u-row>
					<u-row
						customStyle="background:#f7f7f7;border-radius:20rpx;padding:6rpx 16rpx;color:#999;margin-bottom:10rpx">
						<text style="flex-shrink: 0;">回复：</text>
						<text class="u-line-1">{{item.contenTitle}}</text>
					</u-row>
					<u-parse class="u-line-2" :content="formatEmoji(item.text)"></u-parse>
					<u-row justify="space-between" customStyle="color:#999;font-size:26rpx">
						<text>{{$u.timeFormat(item.created,'mm-dd')}}</text>
						<u-row customStyle="color:#a899e6">
							<text>查看</text>
							<u-icon name="arrow-right" size="14" color="#a899e6"></u-icon>
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
		methods: {
			getData(page, limit) {
				this.$http.post('/typechoUsers/inbox', {
					page,
					limit,
					type: 'comment'
				}).then(res => {
					console.log(res)
					this.$refs.paging.complete(res.data.data)
					setTimeout(()=>{
						this.loading = false
					},500)
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
			}
		}
	}
</script>

<style>
	page {
		background: #85a3ff0a;
	}
</style>