<template>
	<view>
		<u-loading-page :loading="loading"></u-loading-page>
		<z-paging ref="paging" v-model="systems" @query="getData" :refresher-enabled="false" v-show="!loading">

			<template #top>
				<u-navbar bgColor="transparent" title="系统" placeholder autoBack>
					<view slot="left">
						<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
			</template>
			<block v-for="(item,index) in systems">
				<view style="margin: 30rpx;padding: 30rpx;border-radius: 20rpx; background: #fff;">
					<view class="u-line-1">
						<text style="font-size: 32rpx;font-weight: 600;">系统通知</text>
					</view>
					<view style="margin-top: 20rpx;">
						<text>{{item.text}}</text>
					</view>
				</view>
			</block>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systems: [],
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
					type: 'system'
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
					type: 'system'
				}).then(res => {
					console.log(res)
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