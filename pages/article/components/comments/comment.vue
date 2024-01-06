<template>
	<view>
		<u-row align="top">
			<view style="position: relative;top: 0;" @tap.stop="goProfile(data)">
				<u-avatar :src="data.userInfo && data.userInfo.avatar" size="30"
					customStyle="border:4rpx solid #85a3ff32"></u-avatar>
				<image class="avatar_head" mode="aspectFill"
					:src="data && data.userInfo && data.userInfo.opt &&  data.userInfo.opt.head_picture">
				</image>
			</view>
			<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
				<u-row align="center">
					<u-row>
						<text
							:style="{color:data && data.userInfo&&data.userInfo.isVip?'#85a3ff':'',fontSize:30+'rpx',fontWeight:600}">{{data.userInfo.screenName?data.userInfo.screenName:data.userInfo.name}}</text>
						<i v-if="data.userInfo.level" :class="`level icon-lv-${data.userInfo.level}`"
							style="font-size: 50rpx; margin-left: 10rpx;"
							:style="{ color: data.userInfo.level > 8 ? $level[Math.floor(data.userInfo.level/2)-1] : $level[data.userInfo.level-1] }">
						</i>
					</u-row>

					<text
						style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
						v-show="article && data && data.userInfo.uid == article.authorId">作者</text>
				</u-row>
				<view style="margin-top:10rpx;word-break: break-word;" @click="reply(data)">
					<uv-parse :preview-img="false" :showImgMenu="false"
						:content="formatEmoji(data && data.text)"></uv-parse>
				</view>
				<u-swiper :list="data && data.images" v-if="data && data.images && data.images.length" :autoplay="false"
					indicator height="150" indicator-style="left" radius="10"
					@click="previewImg(data.images,$event)"></u-swiper>
				<view style="margin-top: 10rpx;" v-if="data && data.subComments.data&&data.subComments.data.length"
					@click="goSubComment(data)">
					<block v-for="(item,index) in data.subComments.data" :key="index">
						<u-row
							customStyle="border-left:6rpx solid #85a3ff1e;padding-left:15rpx;flex-direction:column;padding-bottom:5rpx"
							align="top">
							<u-row>
								<u-row>
									<u-avatar :src="item.userInfo.avatar" size="20"></u-avatar>
									<text
										style="margin-left: 10rpx;font-size: 30rpx;font-weight: 600;">{{item.userInfo.screenName?item.userInfo.screenName:item.userInfo.name}}</text>
								</u-row>
								<text
									style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
									v-if="article && item.userInfo.uid ==  article.authorId">作者</text>
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
							<text>{{data.subComments && data.subComments.count}}条评论</text>
							<i class="ess icon-right_line"></i>
						</view>

					</view>
				</view>
				<u-gap height="6"></u-gap>
				<view style="padding-bottom: 50rpx;">
					<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
						<text>{{$u.timeFrom(data.created,'mm-dd')}}</text>
						<u-row customStyle="flex-basis:30%" justify="space-between">
							<u-row @click="reply(data)">
								<i class="ess icon-chat_4_line" style="font-size: 40rpx;"></i>
								<text style="font-size: 28rpx;margin-left: 10rpx;">回复</text>
							</u-row>
							<u-row>
								<i class="ess icon-thumb_up_2_line" style="font-size: 40rpx;"></i>
								<text
									style="font-size: 28rpx;margin-left: 10rpx;">{{data && data.likes?data.likes:''}}</text>
							</u-row>
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
			reply(data) {
				this.$emit('reply', data)
			},
			goSubComment(data) {
				uni.setStorageSync('subComment_' + data.id, data)
				this.$Router.push({
					path: '/pages/article/components/comments/subComment',
					query: {
						id: data.id
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
						id: data.userInfo.uid
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