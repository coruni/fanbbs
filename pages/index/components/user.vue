<template>
	<z-paging ref="paging" refresher-only @onRefresh="initData">
		<view style="position: relative;top:0">
			<image :src="$store.state.hasLogin?userInfo.avatar:'/static/login.png'" mode="aspectFill"
				style="width: 100%;height: 380rpx;background: #000;"></image>
			<u-row customStyle="position: absolute;top: 60rpx;right:0;margin:20rpx;">
				<u-icon name="scan" size="25" color="#cacdff"></u-icon>
			</u-row>
		</view>
		<view style="position: relative;top: -50rpx;background: #fff;border-radius: 40rpx 40rpx 0 0;">
			<u-avatar :src="userInfo.avatar" size="80" @click="$store.state.hasLogin?goProfile():goLogin()"
				customStyle="position:absolute;top:-80rpx;margin-left:60rpx;border:6rpx solid #fff"></u-avatar>
			<u-row justify="end" customStyle="padding:20rpx">
				<view v-show="$store.state.hasLogin">
					<u-button color="#FB7299C4" plain size="normal" @click="editProfile()"
						customStyle="height:50rpx;border-radius:20rpx">个人资料</u-button>
				</view>
			</u-row>
			<view style="margin:20rpx" v-show="$store.state.hasLogin">
				<u-row justify="space-between">
					<u-row>
						<text
							:style="{color:userInfo.isvip?'#FB7299':'',fontSize:58+'rpx'}">{{userInfo.screenName}}</text>
						<text
							style="font-size: 20rpx;color:white;margin-left:10rpx;background:#FB7299;padding:0 10rpx;border-radius:8rpx;box-shadow:0 0 9rpx 0 #FB7299">
							{{'Lv.'+ userInfo.lv}}
						</text>
					</u-row>
					<u-row customStyle="background:#f7f7f7;padding:6rpx 8rpx;border-radius:10rpx">
						<u-icon name="rmb" color="black" bold size="14"
							customStyle="background:#e8e8e8;padding:2rpx;border-radius:5rpx;margin-right:4rpx"></u-icon>
						<u-count-to :startVal="userMeta.assets?userMeta.assets/100:0" font-size="13"
							:endVal="userMeta.assets"></u-count-to>
					</u-row>
				</u-row>
				<u-row class="u-info">
					<u-icon name="file-text" size="20" class="u-info"></u-icon>
					<text class="u-line-1">{{userInfo.introduce?userInfo.introduce:'暂时还没有简介哦~'}}</text>
				</u-row>
				<u-icon name="checkmark" label="管理员" size="14" color="white"
					customStyle="background:red;border-radius:100rpx;box-shadow:0 0 10rpx 0 red"
					v-if="userInfo.groupKey||userInfo.group=='administrator'"></u-icon>

				<view style="margin-top: 20rpx;">
					<u-row>
						<u-col span="2">
							<view
								style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
								<text>{{userMeta.fanNum}}</text>
								<text>粉丝</text>
							</view>
						</u-col>
						<u-col span="2">
							<view
								style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
								<text>{{userMeta.commentsNum}}</text>
								<text>评论</text>
							</view>
						</u-col>
						<u-col span="2">
							<view
								style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
								<text>{{userMeta.contentsNum}}</text>
								<text>帖子</text>
							</view>
						</u-col>

					</u-row>
				</view>
			</view>
			<view v-if="$store.state.hasLogin">
				<u-gap height="6" customStyle="background:#f4f4f4"></u-gap>
				<view style="margin: 20rpx;">
					<block v-for="(item,index) in userPanel" :key="index">
						<u-row customStyle="margin-top:10rpx">
							<u-icon :name="item.icon" size="20" customStyle="margin-right:10rpx"></u-icon>
							<text>{{item.name}}</text>
						</u-row>

					</block>
				</view>
				<u-gap height="6" customStyle="background:#f4f4f4"></u-gap>
				<!-- 固定区域 -->
				<view style="margin: 20rpx;">
					<u-row align="start" customStyle="flex-direction:column">
						<block v-for="(item,index) in static" :key="index">
							<u-row customStyle="margin-top:10rpx">
								<u-icon :name="item.icon" size="20" customStyle="margin-right:10rpx"></u-icon>
								<text>{{item.name}}</text>
							</u-row>
						</block>
					</u-row>
				</view>
			</view>
			{{userInfo}}
			{{userMeta}}
		</view>
	</z-paging>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				static: [{
						name: '反馈',
						path: '',
						icon: 'file-text-fill'
					},
					{
						name: '客服',
						path: '',
						icon: 'heart-fill'
					}, {
						name: '设置',
						path: '',
						icon: 'setting-fill'
					}
				],
				userPanel: [{
						name: '我的收藏',
						icon: 'file-text-fill'
					},
					{
						name: '我的订单',
						icon: 'file-text-fill'
					},
					{
						name: '收藏',
						icon: 'file-text-fill'
					}
				],
			}
		},
		computed: {
			...mapState(['userInfo', 'userMeta'])
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				if (uni.getStorageSync('token')) {
					this.getUserInfo();
					this.getUserMeta();
				}
				setTimeout(() => {
					//1秒之后停止刷新动画
					this.$refs.paging.complete();
				}, 1000)
			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: this.userInfo.uid
					}
				}).then(res => {
					if (res.data.code) {
						this.$store.commit('setUser', res.data.data)
					}

				}).catch(err => {
					console.log(err)
				})
			},
			getUserMeta() {
				this.$http.get('/typechoUsers/userData').then(res => {
					if (res.data.code) {
						this.$store.commit('setUserMeta', res.data.data)
					}
				})
			},

			goLogout() {
				uni.showLoading({
					mask: true,
					title: '断开主程序中...'
				})
				setTimeout(() => {
					this.$store.commit('logout')
					uni.hideLoading()
				}, 1600)

			},
			goProfile() {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id: this.userInfo.uid
					}
				})
			},
			editProfile(){
				this.$Router.push({
					path:'/pages/user/editProfile'
				})
			},
			goLogin() {
				this.$Router.push({
					path: '/pages/user/login',
				})
			}
		}
	}
</script>

<style>
</style>