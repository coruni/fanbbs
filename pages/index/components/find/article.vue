<template>
	<z-paging @query="getData" ref="paging" v-model="article" style="margin-bottom: 100rpx;">
		<block v-for="(item,index) in article" :key="index" v-if="article">
			<view style="margin: 30rpx;">
				<u-row align="top" style="">
					<u-avatar :src="item.userJson.avatar" size="30"></u-avatar>
					<view style="display: flex;flex-direction: column;flex: 1;margin-left: 20rpx;">
						<view style="flex:1">
							<text style="font-weight: 600;">{{item.userJson.name}}</text>
							<uv-parse :content="formatEmoji(item.text)"></uv-parse>
							<album :data="item"></album>
						</view>
						<view style="margin-top: 40rpx;">
							<u-row justify="space-between" style="color: #999;">
								<i class="ess icon-share_3_line" style="font-size: 40rpx;"></i>
								<i class="ess icon-chat_4_line" style="font-size: 40rpx;"></i>
								<i class="ess icon-thumb_up_2_line" @click="likeTap(item.id,index)" :style="{color:item.isLikes?'#85a3ff':''}" style="font-size: 40rpx;"></i>
							</u-row>
						</view>
					</view>
				</u-row>
			</view>
			<view style="border-top: #f7f7f7 solid 1rpx;"></view>
		</block>
	</z-paging>
</template>

<script>
	import album from './components/album.vue';
	export default {
		components: {
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
			},
			likeTap(id,index){
				this.$http.post('/typechoSpace/spaceLikes',{
					id
				}).then(res=>{
					this.article[index].isLikes = !this.article[index].isLikes
					uni.$u.toast(res.data.msg)
				})
			}
		}
	}
</script>

<style>
</style>