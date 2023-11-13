<template>
	<view>
		<z-paging @query="getData" v-model="article" ref="paging" :refresher-enabled="false" :scrollable="scroll"
			:auto-hide-loading-after-first-loaded="false" :auto-scroll-to-top-when-reload="false"
			:auto-clean-list-when-reload="false">
			<block v-for="(item,index) in article">
				<u-row customStyle="flex-direction:column;margin: 20rpx 30rpx;" align="top" @click="goArticle(item)">
					<text
						style="color: #999;font-size: 26rpx;">{{$u.timeFormat(item.created,'yyyy年mm月dd日')}}·{{item.category[0].name}}</text>
					<text style="font-weight: bold;">{{item.title}}</text>
					<text class="u-line-2">{{item.text}}</text>
					<image v-if="item.images.length>0" :src="item.images[0]" style="width: 100%;height: 350rpx;"
						mode="aspectFill"></image>
				</u-row>
				<u-gap height="6" customStyle="background:#f7f7f7"></u-gap>
			</block>
		</z-paging>
	</view>

</template>

<script>
	export default {
		name: 'articleItem',
		props: {
			uid: {
				type: [String, Number],
				default: 0
			},
			pageScroll: {
				type: Boolean,
				default: true
			},
			isScroll: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				article: [],
				scroll: false,
			}
		},
		watch: {
			isScroll: {
				handler(e) {
					this.scroll = e
				}
			}
		},
		created() {
			console.log('已挂载article')
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/typechoContents/contentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'post',
							uid: this.uid
						})
					}
				}).then(res => {
					if (res.statusCode == 200) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},
		}
	}
</script>

<style>
</style>