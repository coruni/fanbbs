<template>
	<view>
		<z-paging ref="paging" refresher-only @onRefresh="onRefresh" @scroll="scroll">
			<template #top>
				<u-navbar :bgColor="`rgba(255,255,255,${opacity})`" id="navbar">
					<view slot="left">
						<u-row>
							<u-icon name="arrow-left" size="20" :color="opacity>0.4? 'black':'white'"
								@click="$Router.back(1)"></u-icon>
							<u-row customStyle="margin-left:20rpx" v-show="opacity>=1"
								@click="$refs.paging.scrollToTop()">
								<u-avatar :src="info.avatar" size="26"></u-avatar>
								<text style="margin-left:20rpx">{{info.screenName}}</text>
							</u-row>
						</u-row>
					</view>
					<u-button color="#85a3ff" size="mini" slot="right" v-show="opacity>=1">关注</u-button>

				</u-navbar>
			</template>
			<image :src="info && info.userBg?info.userBg:info.avatar" mode="aspectFill"
				style="width: 100%;height: 400rpx;transform: scale(1);"></image>
			<view class="userPanel" id="profile">
				<view style="position: absolute;top: -80rpx;">
					<u-avatar :src="info.avatar" size="80">
					</u-avatar>
					<image class="avatar_head" mode="aspectFill" :src="info && info.opt&&info.opt.head_picture">
					</image>
				</view>

				<u-row justify="space-between" align="top" customStyle="padding-top:20rpx">
					<view>
						<!-- 占位脱离文档流头像 -->
						<u-gap height="40"></u-gap>
						<!-- 占位结束 -->
						<text style="font-weight: 600;font-size: 34rpx;">{{info.screenName}}</text>
						<u-row customStyle="font-size:28rpx">
							<u-icon name="heart" color="#85a3ff" customStyle="margin-right:10rpx"></u-icon>
							<text>通行证ID：{{info.uid}}</text>
						</u-row>

						<u-row customStyle="font-size:28rpx">
							<u-icon name="pushpin" customStyle="margin-right:10rpx"></u-icon>
							<text style="color: #999;">{{info.introduce?info.introduce:'系统默认签名~'}}</text>
						</u-row>
					</view>
					<view style="display: flex;justify-content: center;" v-if="info.uid != $store.state.userInfo.uid">
						<u-button customStyle="height:60rpx;width:120rpx;margin-right:20rpx" color="#85a3ff"
							shape="circle" @click="goPrivate(info)">私信</u-button>
						<u-button :plain="!isfollow" :color="!isfollow?'#85a3ff':'#85a3ff0f'" shape="circle"
							customStyle="height:60rpx;width:160rpx">
							<text :style="{color:isfollow?'black':'#85a3ff'}">{{isfollow?'已关注':'关注'}}</text>
						</u-button>
					</view>
				</u-row>
				<u-row justify="space-around" customStyle="margin-top:40rpx">
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userData &&userData.contentsNum}}</text>
						<text>帖子</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userData &&userData.followNum}}</text>
						<text>关注</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userData &&userData.fanNum}}</text>
						<text>粉丝</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-weight: 600;">{{userData &&userData.commentsNum}}</text>
						<text>评论</text>
					</view>
				</u-row>
			</view>
			<view style="position: relative;top: -60rpx;">
				<view>
					<!-- #ifndef APP -->
					<u-sticky bgColor="#fff">
						<u-tabs :list="tabs" lineColor="#85a3ff" activeStyle="color:#303133;font-weight:bold;"
							:current="tabsIndex" inactiveStyle="color:#999" @change="tabsIndex = $event.index"></u-tabs>
					</u-sticky>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<u-sticky bgColor="#fff" offsetTop="60">
						<u-tabs :list="tabs" lineColor="#85a3ff" activeStyle="color:#303133;font-weight:bold"
							:current="tabsIndex" inactiveStyle="color:#999" @change="tabsIndex = $event.index"></u-tabs>
					</u-sticky>
					<!-- #endif -->
					<swiper style="height: 88vh;" :current="tabsIndex"
						@animationfinish="tabsIndex = $event.detail.current">
						<swiper-item style="overflow: auto;">
							<publish :isScroll="isScroll" :uid="id" ref="publish" v-if=""></publish>
						</swiper-item>
						<swiper-item style="overflow: auto;">
							<comment :isScroll="isScroll" :uid="id" ref="comment"></comment>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</z-paging>
	</view>

</template>

<script>
	import publish from './components/articleItem.vue';
	import comment from './components/commentItem.vue';
	export default {
		components: {
			publish,
			comment,
		},
		props: {
			nav: {
				type: Boolean,
				default: false
			},

		},
		data() {
			return {
				id: 0,
				info: {},
				swiperIndex: 0,
				tabsIndex: 0,
				isfollow: false,
				userData: {},
				isScroll: false,
				tabs: [{
						name: '帖子'
					},
					{
						name: '评论'
					},
					{
						name: '收藏'
					}
				],
				stopMove: false,
				opacity: 0,
				scrollTop: 0,
				isScroll: false,
				elementHeight: 0,
				navbarHeight: 0,
			};
		},
		onLoad(params) {
			if (params) {
				this.id = params.id
				this.getAuthor(params.id)
				this.isFollow(params.id)
				this.getUserData(params.id)
			}
		},
		created() {

		},
		onReady() {
			uni.createSelectorQuery().in(this).select('#profile').boundingClientRect(data => {
				this.elementHeight = data.bottom
			}).exec()
		},
		methods: {
			getAuthor(id) {
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: id
					}
				}).then(res => {
					console.log(res)
					if (res.statusCode == 200) {
						this.info = res.data.data
					}
				})
			},
			isFollow(id) {
				this.$http.get('/typechoUsers/isFollow', {
					params: {
						touid: id,
						token: uni.getStorageSync('token')
					}

				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.isfollow = true
					}
				})
			},
			onRefresh() {
				setTimeout(() => {
					this.$refs.paging.complete();
				}, 1000)

			},
			changTab(data) {
				this.tabsIndex = data.index
				this.swiperIndex = data.index
			},
			animationfinish(data) {
				this.swiperIndex = data.detail.current
				this.tabsIndex = data.detail.current
			},
			scroll(data) {
				const scrollTop = data.detail.scrollTop;
				console.log(scrollTop, this.elementHeight)
				this.opacity = scrollTop / 200;
				if (scrollTop >= this.elementHeight) this.isScroll = true
				else this.isScroll = false
			},
			getUserData(uid) {
				this.$http.get('/typechoUsers/userData', {
					params: {
						uid
					}
				}).then(res => {
					if (res.data.code) {
						this.userData = res.data.data
					}
				})
			},
			goPrivate(data) {
				if (data.uid == this.$store.state.userInfo.uid) {
					uni.$u.toast('不能私聊自己')
					return;
				}
				this.$Router.push({
					path: '/pages/notice/private',
					query: {
						id: data.uid,
						nickname: data.screenName
					}
				})
			},

		}
	}
</script>

<style lang="scss">
	.userMate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
	}

	.userPanel {
		position: relative;
		top: -60rpx;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		padding: 0 40rpx 40rpx 40rpx;
		border-bottom: 1rpx solid #f7f7f7;
	}

	.u-button::before {
		background: #85a3ff;
	}
</style>