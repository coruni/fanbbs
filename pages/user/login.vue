<template>
	<view>
		<u-navbar autoBack bg-color="rgba(0,0,0,0)" left-icon="close" fixed left-icon-color="white"
			height="80"></u-navbar>
		<image src="/static/login.png" mode="aspectFill" style="width: 100%;height: 400rpx;"></image>
		<view style="margin: 40rpx;">
			<u-text :text="isLogin?'用户登录':'用户注册'" size="17" bold></u-text>
			<!-- 登录用 -->
			<view v-show="isLogin">
				<u--input placeholder="邮箱/账号" prefixIcon="email" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="account">
				</u--input>
				<u-gap></u-gap>
				<u--input placeholder="密码" type="password" prefixIcon="lock" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="password">
				</u--input>
			</view>
			<!-- 注册用 -->
			<view v-show="!isLogin">
				<u--input placeholder="用户名" prefixIcon="arrow-up" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="username">
				</u--input>
				<u-gap></u-gap>
				<u--input placeholder="邮箱" prefixIcon="email" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="account">
					<template slot="suffix">
						<u-code ref="uCode" :seconds="seconds" @change="codeChange" seconds="20"
							changeText="X秒重新获取"></u-code>
						<u-button @tap="getCode" :text="tips" plain color="#FB7299" size="mini"></u-button>
					</template>
				</u--input>
				<u-gap></u-gap>
				<u--input placeholder="密码" type="password" prefixIcon="lock" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="password">
				</u--input>
				<u-gap></u-gap>
				<u--input placeholder="验证码" type="number" prefixIcon="fingerprint" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="password">
				</u--input>
			</view>
			<u-row justify="space-between"
				customStyle="margin-top:20rpx;font-weight:bold;font-size:30rpx;color:#414141">
				<text @click="isLogin=!isLogin">{{isLogin?'注册':'登录'}}</text>
				<text>忘记密码？</text>
			</u-row>
			<view style="margin-top:20rpx">
				<u-row>
					<u-checkbox-group>
						<u-checkbox @change="accept=!accept" v-model="accept" activeColor="#FB7299" size="15" shape="circle"></u-checkbox>
					</u-checkbox-group>
					<u-row customStyle="font-size:30rpx">
						<text>登录及代表你同意</text>
						<text style="color:#FB7299">《用户协议》</text>
						<text>与</text>
						<text style="color:#FB7299">《隐私政策》</text>
					</u-row>
				</u-row>
			</view>

			<view style="margin-top: 40rpx;">
				<u-button :text="isLogin?'登录':'注册'" :hairline="false" color="#FB7299" size="mini" loading-size="10"
					customStyle=";padding:30rpx 80rpx;font-size:28rpx;width:200rpx;border-radius:10rpx;box-shadow:0 0 9rpx 0 #FB7299"
					@click="isLogin?login():register()"></u-button>
			</view>
			<u-gap height="60"></u-gap>
			<u-row justify="center">
				<u-row justify="space-between" customStyle="flex-basis:40%">
					<block v-for="(item,index) in loginBtn" :key="index">
						<u-row customStyle="flex-direction:column">
							<u-icon :name="item.icon" size="30" color="white"
								:customStyle="{padding:10+'rpx',background:item.color,borderRadius:50+'rpx'}"></u-icon>
							<text style="margin-top: 10rpx;">{{item.name}}</text>
						</u-row>
					</block>
				</u-row>
			</u-row>

		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				username: null,
				account: null,
				password: null,
				isLogin: true,
				tips: null,
				accept: false,
				seconds: 120,
				loginBtn: [{
						provider: 'weixin',
						name: '微信',
						icon: 'weixin-fill',
						color: '#5ac725'
					},
					{
						provider: 'qq',
						name: 'QQ',
						icon: 'qq-fill',
						color: '#3c9cff'
					}
				],

			};

		},
		computed: {

		},
		methods: {
			...mapMutations(['setToken', 'setUser']),
			codeChange(text) {
				this.tips = text
			},
			getCode() {
				if (this.account == null) {
					uni.$u.toast('邮箱填写错误');
					return
				}
				if (this.$refs.uCode.canGetCode) {
					this.$http.post('/typechoUsers/RegSendCode', {
						params: JSON.stringify({
							mail: this.account
						})
					}).then(res => {
						console.log(res)
						this.$refs.uCode.start();
					})
				}
			},
			login() {
				if (this.account == null) {
					uni.$u.toast('请填写账号')
					return
				}
				if (this.password == null) {
					uni.$u.toast('请填写密码')
					return
				}
				if (!this.accept) {
					uni.$u.toast('请同意协议')
					return
				}
				this.$http.post('/typechoUsers/userLogin', {
					params: JSON.stringify({
						name: this.account,
						password: this.password
					})
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.setToken(res.data.data.token);
						this.setUser(res.data.data);
						uni.$u.toast('已连接主程序')
						setTimeout(() => {
							this.$Router.back(1)
						}, 2000)
					}else{
						uni.$u.toast(res.data.msg)
					}
				})
			}

		}
	}
</script>

<style lang="scss">

</style>