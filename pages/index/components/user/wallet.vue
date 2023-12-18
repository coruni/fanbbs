<template>
	<z-paging-swiper>
		<view style="flex: 1;display: flex;flex-direction: column;" :style="{height:pageHeight+'px'}">
			<u-navbar placeholder title="钱包" autoBack bgColor="transparent"></u-navbar>
			<view style="margin: 30rpx;padding: 30rpx;background: #fff;border-radius: 20rpx;">
				<u-row justify="space-between">
					<view
						style="background: #85a3ffa0;border-radius: 20rpx;padding: 30rpx;display: flex;align-items: center;width: 200rpx;">
						<i class="ess icon-yinhangka" style="font-size: 36rpx;color: white;"></i>
						<text style="margin-left: 30rpx;color: #fff;">{{userData&&userData.assets}}</text>
					</view>
					<view>
						<u-button color="#85a3ffa0" shape="circle" throttleTime="1000"
							customStyle="height:60rpx;width:120rpx" @click="showPayment = true">充值</u-button>
					</view>
				</u-row>
				<view style="margin-top: 20rpx;">
					<text style="font-weight: 600;">我的会员</text>
					<view
						style="margin-top: 20rpx;padding: 30rpx;border-radius: 20rpx;background: linear-gradient(89deg, rgba(255, 133, 163, 0.48) 21%,rgba(255, 163, 133, 0.55) 62%);">
						<u-row justify="space-between">
							<u-icon name="level" color="#fff" size="24" customStyle="opacity: 0.5;"></u-icon>
							<view style="margin-left: 20rpx;">
								<text style="color: #fff;">{{!userInfo.vip?'未开通':$u.timeFrom(userInfo.vip)}}</text>
							</view>
						</u-row>
					</view>

				</view>
			</view>
			<u-tabs :list="tabs" :scrollable="false" :current="tabsIndex" @change="tabsIndex = $event.index"></u-tabs>
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
					<z-paging @query="getLog" v-model="logs" ref="paging">
						<block v-for="(item,index) in logs" :key="index">
							<view style="background: #fff;border-radius: 20rpx;padding: 30rpx;margin: 30rpx;">
								<view style="display: flex;flex-direction: column;">
									<u-row justify="space-between"
										customStyle="padding-left: 20rpx; border-left: 6rpx #85a3ff1e solid;">
										<view>
											<text>{{item.subject}}</text>
											<text style="margin-left: 20rpx;"
												:style="{color:item.totalAmount>0?'red':'green'}">{{item.totalAmount>0?'+'+item.totalAmount:item.totalAmount}}</text>
										</view>

										<text
											style="color: #999;font-size: 28rpx;">{{$u.timeFormat(item.created,'mm-dd')}}</text>
									</u-row>
								</view>
							</view>
						</block>
					</z-paging>
				</swiper-item>
			</swiper>
			<!-- 组件 -->
			<!-- 充值 -->

		</view>
		<u-popup round="10" :show="showPayment" @close="showPayment = false;selectPackage =payPackage[0]">
			<view style="padding: 30rpx;">
				<view style="text-align: center;">
					<text>选择充值套餐</text>
				</view>
				<u-grid col="3">
					<u-grid-item v-for="(item,index) in payPackage" :key="index">
						<view style="display: flex;
							flex-direction: column;
							padding: 30rpx;
							
							border: #85a3ff solid 2rpx; 
							width: 80rpx;
							margin: 30rpx;
							border-radius: 20rpx;" @click="selectPackage = item"
							:style="{background:selectPackage && selectPackage.id == item.id?'#85a3ff1e':''}">
							<view style="color: #85a3ff;display: flex;justify-content: center;align-items: baseline;">
								<text style="font-size: 26rpx;">￥</text>
								<text style="font-size: 50rpx;">{{item.price}}</text>
							</view>
							<view style="color: #999;text-align: center;font-size: 24rpx;">
								<text>积分{{item.price*config.scale}}</text>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
				<view style="margin-top: 20rpx;">
					<u-radio-group v-model="radio" placement="column">
						<block v-for="(item,index) in payMent" :key="index">
							<u-row justify="space-between" style="flex:1;margin-bottom: 30rpx"
								@click="radio = item.name">
								<u-row>
									<view :style="`background:${item.color};padding:10rpx;border-radius:50rpx`">
										<u-icon :name="item.icon" color="#fff" size="24"></u-icon>
									</view>
									<text style="margin-left: 20rpx;">{{item.name}}</text>
								</u-row>
								<u-radio :name="item.name" activeColor="#85a3ff"></u-radio>
							</u-row>
						</block>
					</u-radio-group>
				</view>
				<u-row justify="space-between" @click="showCard = true">
					<text>使用卡密</text>
					<i class="ess icon-right_line" style="font-size: 34rpx;"></i>
				</u-row>
				<view style="margin-top: 20rpx;">
					<u-button color="#85a3ff" shape="circle"
						@click="selectPackage?goPay():$u.toast('你还有选择充值金额哦~')">充值</u-button>
				</view>
			</view>
			<u-popup :show="showCard" round="10" customStyle="z-index: 10175;" @close="showCard = false" closeable>
				<view style="height: 40vh;padding: 60rpx 30rpx 30rpx 30rpx;">
					<text style="margin-bottom: 10rpx;">输入卡密</text>
					<u-input v-model="card" placeholder="卡密" border="bottom"></u-input>

				</view>
				<view style="position: fixed;bottom: 0;width: 100%;">
					<view style="padding: 30rpx;">
						<u-button color="#85a3ff" shape="circle" @click="cardPay()">充值</u-button>
					</view>
				</view>

			</u-popup>
		</u-popup>

	</z-paging-swiper>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				card: null,
				showCard: false,
				logs: [],
				pageHeight: 0,
				showPayment: false,
				userData: {},
				tabs: [{
					name: '任务'
				}, {
					name: '记录'
				}],
				tabsIndex: 0,
				appInfo: {},
				customPrice: 0,

				payMent: [{
						name: '微信',
						type: 'wxpay',
						icon: 'weixin-fill',
						color: '#46d262'
					},
					{
						name: '支付宝',
						type: 'alipay',
						icon: 'zhifubao',
						color: '#0070ff'
					},
					{
						name: '三方支付',
						type: 'easypay',
						icon: 'bookmark',
						color: '#a899e6'
					}
				],
				payPackage: [{
					id: 1,
					price: 1,
				}, {
					id: 2,
					price: 6
				}, {
					id: 3,
					price: 15
				}, {
					id: 4,
					price: 30
				}, {
					id: 5,
					price: 60
				}, {
					id: 6,
					price: 100
				}],
				selectPackage: {
					id: 1
				},
				radio: '微信',
				config: {},
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
		computed: {
			...mapState(['userInfo'])
		},
		created() {
			this.selectPackage = this.payPackage[0]
			this.initData()
			this.appInfo = this.$store.state.appInfo
			this.pageHeight = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight
		},
		methods: {
			initData() {
				this.getData()
				this.getConfig()
			},
			getData() {
				this.$http.post('/user/userData').then(res => {
					if (res.data.code) {
						this.userData = res.data.data
						this.task[0].check = res.data.data.isClock
					}
				})
			},
			getConfig() {
				this.$http.get('/shop/vipInfo').then(res => {
					if (res.data.code) {
						console.log(res)
						this.config = res.data.data
					}
				})
			},
			getLog(page, limit) {
				this.$http.post('/pay/payLogList', {
					page,
					limit
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},
			goPay() {
				switch (this.radio) {
					case '微信':
						this.pay('wxpay')
						break;
					case '支付宝':
						this.pay('alipay')
						break;
					case '三方支付':
						this.orderPay()
						break;

					default:
						break;
				}
			},
			pay(provider) {
				if (provider == '')
					uni.requestPayment({
						provider: provider,

					})
			},
			cardPay() {
				if (this.card == null) {
					uni.$u.toast('卡密不可为空')
					return;
				}
				this.$http.post('/pay/tokenPay', {
					key: this.card
				}).then(res => {
					if (res.data.code) {
						uni.$u.toast(res.data.msg)
						this.showCard = false;
						this.showPayment = false;
						this.card = null
						this.getData()
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

	::v-deep .u-grid-item--hover-class {
		opacity: unset;
	}
</style>