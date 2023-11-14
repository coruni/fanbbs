<template>
	<view>
		<z-paging ref="paging" @query="getData" v-model="comments">
			<template #top>
				<u-navbar autoBack placeholder>
					<u-icon name="list" slot="right" size="24"></u-icon>
				</u-navbar>
			</template>
			<!-- onload请求数据慢于onReady 先判断数据是否存在 -->
			<view style="margin: 0rpx 30rpx 30rpx 30rpx;" v-if="article.userJson">
				<u-row>
					<u-avatar :src="article.userJson.avatar" size="30"></u-avatar>
					<text style="margin-left: 20rpx;"
						:style="{color:article.userJson.isvip?'#FB7299':''}">{{article.userJson.name}}</text>
				</u-row>
				<view style="margin-top: 20rpx;">
					<u-parse :content="article.text" style="word-wrap: break-word;word-break: break-all;"></u-parse>
				</view>
				<view style="margin-top: 10rpx;">
					<u-album :urls="article.pic.images" borderRadius="10" multipleSize="100"></u-album>
				</view>
			</view>
			<u-gap height="8" bgColor="#f4f4f4"></u-gap>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				comments: [],
				id: 0,
				article: {},
			};
		},
		onLoad(params) {

			this.getArticle(params.id)
		},
		methods: {
			getData() {

			},
			getArticle(id) {
				this.$http.get('/typechoSpace/spaceInfo', {
					params: {
						id
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						let data = res.data.data
						data.pic = JSON.parse(res.data.data.pic)
						this.article = data;
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>