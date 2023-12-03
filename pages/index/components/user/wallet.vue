<template>
	<view style="flex: 1;display: flex;flex-direction: column;" :style="{height:pageHeight+'px'}">
		<u-navbar placeholder title="钱包" autoBack bgColor="transparent"></u-navbar>
		<view style="margin: 30rpx;padding: 30rpx;background: #fff;border-radius: 20rpx;">
			<u-row justify="space-between">
				<view
					style="background: #85a3ffa0;border-radius: 20rpx;padding: 30rpx;display: flex;align-items: center;width: 200rpx;">
					<u-icon name="bookmark" color="#fff" size="24"></u-icon>
					<text style="margin-left: 30rpx;color: #fff;">{{userData&&userData.assets}}</text>
				</view>
				<view>
					<u-button color="#85a3ffa0" shape="circle" throttleTime="1000"
						customStyle="padding:0 60rpx">充值</u-button>
				</view>
			</u-row>
			<view style="margin-top: 20rpx;">
				<text style="font-weight: 600;">我的会员</text>
				<view style="margin-top: 20rpx;padding: 30rpx;border-radius: 20rpx;background: linear-gradient(89deg, rgba(255, 133, 163, 0.48) 21%,rgba(255, 163, 133, 0.55) 62%);">
					<u-row>
						<u-icon name="level" color="#fff" size="24" customStyle="opacity: 0.5;"></u-icon>
						<view style="margin-left: 20rpx;">
							
						</view>
					</u-row>
				</view>
				
			</view>
		</view>
		<u-tabs :list="tabs" :scrollable="false" :current="tabsIndex"
			@change="tabsIndex = $event.index"></u-tabs>
		<swiper style="flex:1;" :current="tabsIndex" @animationfinish="tabsIndex = $event.detail.current">
			<swiper-item>
				<view style="margin: 30rpx;">
					<view style="display: flex; flex-direction: column;">
						<text style="font-weight: 600;">每日任务</text>
						<text
							style="color: #999;font-size: 28rpx;">今日获取{{appInfo && appInfo.currencyName?appInfo.currencyName:'积分'}}上限</text>
					</view>
					<view>
						<block v-for="(item,index) in task" :key="index">
							<view
								style="font-size: 28rpx;margin: 30rpx 0;background: #fff; border-radius: 20rpx;padding:30rpx;display: flex;justify-content: space-between;">
								<u-row>
									<u-icon :name="item.icon" size="22"></u-icon>
									<view style="display: flex;flex-direction: column;margin-left: 30rpx;">
										<text>{{item.name}}</text>
										<text style="font-size: 24rpx;">+{{item.point}}</text>
									</view>
								</u-row>
								<view style="display: flex;flex-direction: column;">
									<u-row>
										<text style="color: #85a3ff;">{{item.check}}</text>
										<text>/{{item.times}}</text>
									</u-row>
				
								</view>
							</view>
						</block>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				12312
			</swiper-item>
		</swiper>
		
	</view>

</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				pageHeight: 0,
				userData: {},
				tabs: [{
					name: '任务'
				}, {
					name: '记录'
				}],
				tabsIndex: 0,
				appInfo: {},
				task: [{
						name: '打卡',
						point: 5,
						times: 1,
						check: this.userData && this.userData.isClock ? 1 : 0,
						icon: 'heart'
					},
					{
						name: '点赞',
						point: 2,
						times: 3,
						check: 0,
						icon: 'heart'
					},
					{
						name: '浏览帖子',
						point: 5,
						times: 2,
						check: 0,
						icon: 'heart'
					},
					{
						name: '分享',
						point: 5,
						times: 1,
						check: 0,
						icon: 'heart'
					}
				]
			}
		},
		computed:{
			...mapState(['userInfo'])
		},
		created() {
			this.getData()
			this.appInfo = this.$store.state.appInfo
			this.pageHeight = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight
		},
		methods: {
			getData() {
				this.$http.post('/typechoUsers/userData').then(res => {
					if (res.data.code) {
						this.userData = res.data.data
						this.task[0].check = res.data.data.isClock
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
</style>				<view style="padding: 30rpx;" :style="{background:$u.colorGradient('rgb(255, 85, 255)', 'rgb(170, 255, 255)', 10)}">
