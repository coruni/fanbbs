<template>
	<z-paging @query="getData" ref="paging" v-model="article" style="margin-bottom: 100rpx;">
		<block v-for="(item,index) in article" :key="index" v-if="article">
			<view style="margin: 30rpx;">
				<u-row align="top" style="margin-bottom: 60rpx;">
					<u-avatar :src="item.userJson.avatar" size="30"></u-avatar>
					<u-row customStyle="margin-left:20rpx;flex:1">
						<view style="flex:1">
							<text>{{item.userJson.name}}</text>
							<uv-parse :content="formatEmoji(item.text)"></uv-parse>
							<album :data="item"></album>
						</view>
					</u-row>
				</u-row>
			</view>
			<view style="border-top: #f7f7f7 solid 1rpx;"></view>
		</block>
	</z-paging>
</template>

<script>
	import album from './components/album.vue';
	export default {
		components:{
			album
		},
		props: {
			type: {
				type: String,
				default: 'all'
			},
		},

		data() {
			return {
				article: [],
				showComemnts: false,
				id: 0,
				elWidth: 300,

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
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},

			reload() {
				this.$refs.paging.reload()
			},
			goShare(data) {
				console.log('getData')
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
			}
		}
	}
</script>

<style>
</style>