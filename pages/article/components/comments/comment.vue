<template>
	<view>
		<u-row align="top">
			<view style="position: relative;top: 0;" @tap.stop="goProfile(data)">
				<u-avatar :src="data && data.avatar" size="30" customStyle="border:4rpx solid #85a3ff32"></u-avatar>
				<image class="avatar_head" mode="aspectFill" :src="data && data.opt && data.opt.head_picture">
				</image>
			</view>
			<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
				<u-row align="center">
					<u-row>
						<text
							:style="{color:data && data.isvip?'#85a3ff':'',fontSize:30+'rpx',fontWeight:600}">{{data.author}}</text>
						<i v-if="data.level" :class="`level icon-lv-${data.level}`"
							style="font-size: 50rpx; margin-left: 10rpx;"
							:style="{ color: data.level > 8 ? $level[Math.floor(data.level/2)-1] : $level[data.level-1] }">
						</i>
					</u-row>
					
					<text
						style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
						v-show="data && data.authorId == article.authorId">作者</text>
				</u-row>
				<view style="margin-top:10rpx;word-break: break-word;" @click="reply(data)">
					<uv-parse :preview-img="false" :showImgMenu="false"
						:content="formatEmoji(data && data.text)"></uv-parse>
				</view>
				<u-swiper :list="data && data.images" v-if="data && data.images && data.images.length" :autoplay="false"
					indicator height="150" indicator-style="left" radius="10"
					@click="previewImg(data.images,$event)"></u-swiper>
				<view style="margin-top: 10rpx;" v-if="data && data.sonComments.data&&data.sonComments.data.length"
					@click="goSubComment(data)">
					<block v-for="(item,index) in data.sonComments.data" :key="index" v-if="index<2">
						<u-row
							customStyle="border-left:6rpx solid #85a3ff1e;padding-left:15rpx;flex-direction:column;padding-bottom:5rpx"
							align="top">
							<u-row>
								<u-row>
									<u-avatar :src="item.avatar" size="20"></u-avatar>
									<text
										style="margin-left: 10rpx;font-size: 30rpx;font-weight: 600;">{{item.author}}</text>
								</u-row>
								<text
									style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
									v-if="item.authorId == article.authorId">作者</text>
							</u-row>
							<view>
								<uv-parse selectable :showImgMenu="false" :preview-img="false"
									style="font-size:15px;color:#454545" :content="formatEmoji(item.text)"></uv-parse>
							</view>
						</u-row>
					</block>
					<view style="margin-top: 30rpx;">
						<view
							style="padding:8rpx 20rpx;font-size: 26rpx;background:#85a3ff1e;font;display: flex;align-items: center;width: 180rpx;border-radius: 500rpx;justify-content: space-around;">
							<text>{{data.sonComments.count}}条评论</text>
							<u-icon name="arrow-right" size="13"></u-icon>
						</view>

					</view>
				</view>
				<u-gap height="6"></u-gap>
				<view style="padding-bottom: 50rpx;">
					<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
						<text>{{$u.timeFrom(data.created,'mm-dd')}}</text>
						<u-row customStyle="flex-basis:30%" justify="space-between">
							<u-icon name="chat" color="#aaa" label="回复" size="20" labelColor="#aaa" label-size="12"
								@click="reply(data)"></u-icon>
							<u-icon name="thumb-up" color="#aaa" :label="data && data.likes?data.likes:''" size="20"
								labelColor="#aaa" label-size="12"></u-icon>
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
			},
			article: {
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
							allparent: this.data.coid,
						}),
						order: 'created asc'
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
			goSubComment(data) {
				uni.setStorageSync('subComment_' + data.coid, data)
				this.$Router.push({
					path: '/pages/article/components/comments/subComment',
					query: {
						id: data.coid
					}
				})
			},
			previewImg(urls, index) {
				uni.previewImage({
					urls: urls,
					current: index
				})
			},
			goProfile(data) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id: data.authorId
					}
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
			}
		}
	}
</script>

<style>
</style>