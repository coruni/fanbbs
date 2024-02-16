<template>
	<view>
		<u-navbar title="确认订单" autoBack placeholder></u-navbar>
		<view style="margin: 20rpx;" v-if="info">
			<u-transition mode="slide-down" :show="showPayment">
				<view
					style="padding: 30rpx;border-radius: 20rpx;background: #00cccc;margin-bottom: 20rpx;color: white;">
					<i class="ess icon-check_2_line"></i>
					<text style="margin-left: 20rpx;">该订单已支付完成</text>
				</view>
			</u-transition>
			<view style="padding: 30rpx;border-radius: 20rpx;background: white;">
				<u-row align="top">
					<u-icon name="map" size="20"></u-icon>
					<view style="display: flex;flex-direction: column;padding: 0 10rpx;">
						<u-row align="end">
							<text style="font-weight: 600;">{{info.address&& info.address.contacts}}</text>
							<u-row align="baseline" style="margin-left: 20rpx;font-size: 28rpx;">
								<i class="ess icon-cellphone_line"></i>
								<text>{{info.address&& info.address.phone}}</text>
							</u-row>
						</u-row>
						<text
							style="font-size: 28rpx;word-break: break-all;">{{info.address && info.address.address}}</text>
					</view>
					<u-col :span="3">
						<u-button shape="circle" plain style="height: 60rpx;flex-shrink: 0;"
							@click="!info.paid?showAddress = true:$u.toast('该订单已支付，请联系卖家')">修改地址</u-button>
					</u-col>
				</u-row>
			</view>
			<view style="padding: 30rpx;background: white;border-radius: 20rpx;margin-top: 20rpx;">
				<u-row style="margin-bottom: 20rpx;" justify="space-between">
					<u-row>
						<u-avatar :src="info.bossInfo.avatar" size="30"></u-avatar>
						<text style="margin-left: 20rpx;font-weight: 600;"
							class="u-line-1">{{info.bossInfo.nickname}}</text>
					</u-row>
					<i class="ess icon-right_line"></i>
				</u-row>
				<u-row align="top">
					<image :src="info.specs.image?info.specs.image:info.product_image[0]" mode="aspectFill"
						style="width: 120rpx;height: 120rpx;border-radius: 20rpx;background: #f7f7f7;flex-shrink: 0;">
					</image>
					<view
						style="display: flex;flex-direction: column;justify-content: center;margin-left: 20rpx;flex:1">
						<text style="font-weight: 600;font-size: 32rpx;word-break: break-all;"
							class="u-line-1">{{info.product_name}}</text>
						<u-row style="font-size: 28rpx;color: #999;" justify="space-between">
							<text>已选：{{info.specs.name}}</text>
							<u-row style="color: red;">
								<i class="ess icon-coin_line"></i>
								<text>{{info.specs.price}}</text>
							</u-row>
						</u-row>
					</view>
				</u-row>
				<view style="margin-top: 20rpx;">
					<u-row justify="space-between">
						<text>运费：</text>
						<u-row style="color: red;">
							<i class="ess icon-coin_line"></i>
							<text>{{info.freight}}</text>
						</u-row>
					</u-row>
					<u-row justify="space-between">
						<text>总计：</text>
						<u-row style="color: red;">
							<i class="ess icon-coin_line"></i>
							<text>{{info.price}}</text>
						</u-row>
					</u-row>
				</view>
				<text>订单号：{{info.orders}}</text>
			</view>

			<!-- // 用户信息 -->
			<view style="margin-top: 20rpx;background: white;padding: 30rpx;border-radius: 20rpx;">
				<u-row justify="space-between">
					<text>余额：</text>
					<u-row>
						<i class="ess icon-coin_line"></i>
						<text>{{$store.state.userInfo.assets}}</text>
					</u-row>
				</u-row>

			</view>
			<!-- 更多好物 -->
			<view style="margin-top: 40rpx;background: white;padding: 30rpx;border-radius: 20rpx;">
				<text style="font-weight: 600;">好物推荐</text>
			</view>

		</view>
		<view style="position: fixed;bottom: 0;width: 100%;">
			<u-row justify="space-between" style="background: white;padding: 15rpx 30rpx;">
				<view>
					<i class="ess icon-headphone_line" style="font-size: 40rpx;"></i>
				</view>
				<view>
					<u-button shape="circle" style="width: 200rpx;" :color="info.paid?'#ccc':'#ff0800'"
						@click="!info.paid?$refs.payMent.open():''">{{info.paid?'该订单已支付':'立即支付'}}</u-button>
				</view>
			</u-row>
		</view>
		<uv-modal :showConfirmButton="false" ref="payMent" title="提示" width="500rpx">
			<view style="flex:1;display: flex;flex-direction: column;">
				<view style="text-align: center;">
					<text>是否支付？</text>
				</view>
				<view style="margin-top: 30rpx;">
					<u-row>
						<u-button plain shape="circle" style="margin-right: 10rpx;"
							@click="$refs.payMent.close()">取消</u-button>
						<u-button shape="circle" color="#ff0800" style="margin-left: 10rpx;"
							@click="buy()">确定</u-button>
					</u-row>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</uv-modal>
		<u-popup :show="showAddress" @close="showAddress = false" closeable round="10">
			<view style="margin-top: 30rpx;text-align: center;">
				<text>收货地址</text>
			</view>
			<view style="margin: 30rpx;height: 50vh;">
				<u-form :model="address" :rules="rules" ref="address">
					<u-form-item :borderBottom="false" prop="contacts" label="收货人" label-width="80">
						<u-input v-model="address.contacts" placeholder="名字"></u-input>
					</u-form-item>
					<u-form-item :borderBottom="false" prop="phone" label="手机号" label-width="80">
						<u-input v-model="address.phone" maxlength="11" placeholder="手机号"></u-input>
					</u-form-item>
					<u-form-item :borderBottom="false" prop="province" label="所在地区" label-width="80">
						<u-input v-model="address.region" disabled :placeholder="address.region?address.region:'所在地区'"
							@click="getLocaltion()">
							<template slot="suffix">
								<u-icon name="map" color="#ff0800" size="20" @click="getLocaltion()"></u-icon>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item :borderBottom="false" prop="detailAddress" label="详细地址" label-width="80">
						<u-textarea placeholder="镇/村/门牌号" v-model="address.detailAddress" height="40"></u-textarea>
					</u-form-item>
				</u-form>
				<u-button color="#ff0800" style="margin-top: 60rpx;" shape="circle"
					@click="saveAddress();showAddress=false">保存</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				info: {},
				showPayment: false,
				showAddress: false,
				address: {
					contacts: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					detailAddress: '',
					address: '',
					region: ''
				},
				rules: {
					// 字段名称
					'contacts': {
						type: 'string',
						required: true,
						min: 2,
						max: 8,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'phone': {
						type: 'string',
						required: true,
						pattern: '[0-9]',
						message: '请填写正确手机号码',
						len: 11,
						min: 11,
						trigger: ['blur', 'change']
					},
					'province': {
						type: 'string',
						required: true,
						message: '请定位获取位置',
						trigger: ['blur', 'change']
					},
					'detailAddress': {
						type: 'string',
						required: true,
						message: '请输入正确地址',
						trigger: ['blur', 'change']
					}
				}
			};
		},
		onLoad(params) {
			this.id = params.id
			this.getData(params.id)
		},
		created() {
			this.getUserInfo()
		},
		methods: {
			getData(id) {
				this.$http.post('/shop/order', {
					id
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.info = res.data.data
						if (res.data.data.paid) this.showPayment = true;
						this.address = res.data.data.address
					}
				})
			},
			getUserInfo() {
				this.$http.get('/user/userInfo', {
					params: {
						key: this.$store.state.userInfo.uid,
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}
				}).then(res => {
					if (res.data.code) {
						console.log(res)
						this.$store.commit('setUser', res.data.data)
					}
				})
			},
			buy() {
				this.$http.post('/shop/buy', {
					id: this.info.id,
				}).then(res => {
					if (res.data.code) {
						uni.$u.toast('已下单，请等待商家配送')
						this.getData()
						this.showPayment = true
					}
					uni.$u.toast(res.data.msg)
					this.$refs.payMent.close()
				})
			},
			saveAddress() {
				let address = this.address
				address.address = address.region + address.detailAddress
				this.$http.post('/shop/tracking', {
					id: this.info.id,
					address: JSON.stringify(address)
				}).then(res => {
					if (res.data.code) {
						this.getData(this.info.id)
					}
					uni.$u.toast(res.data.msg)
				})
			},
			getLocaltion() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (res) => {
						console.log(res)
						this.address.region = res.address.province + res.address.city + res.address.district
						this.address.province = res.address.province
						this.address.city = res.address.city
						this.address.district = res.address.district
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}
</style>