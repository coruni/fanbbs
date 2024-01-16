<template>
	<view>
		<u-navbar autoBack bg-color="rgba(0,0,0,0)" left-icon="close" fixed left-icon-color="white"
			height="80"></u-navbar>
		<view style="position: relative;top: 0;">
			<image src="/static/login.jpg" mode="aspectFill" style="width: 100%;height: 400rpx;"></image>
			<view style="width: 100%;position: absolute;bottom: 0;">
				<view style="background: white;padding: 20rpx;border-radius: 20rpx 20rpx 0 0;">
				</view>
			</view>
		</view>
		<view style="margin: 40rpx;margin-top: 20rpx;" v-show="!isForget">
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
				<u--input placeholder="密码" type="password" prefixIcon="lock" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="password">
				</u--input>
				<u-gap></u-gap>
				<u--input placeholder="确认密码" type="password" prefixIcon="lock" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="password2">
				</u--input>
				<u-gap></u-gap>
				<u--input placeholder="邮箱" prefixIcon="email" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="bottom" v-model="email">
				</u--input>
				<u-gap></u-gap>
				<view v-if="config && config.isEmail">
					<u-row customStyle="border-bottom:1rpx solid #dadbde">
						<u--input placeholder="验证码" type="number" prefixIcon="fingerprint"
							prefixIconStyle="font-size:40rpx" customStyle="padding:15rpx 0 0 0" border="none"
							v-model="code">
						</u--input>
						<view>
							<u-code ref="uCode" @change="codeChange" seconds="120"></u-code>
							<u-button @tap="getCode" plain color="#85a3ff" size="mini">{{tips}}</u-button>
						</view>
					</u-row>
				</view>
				<view v-if="config.isInvite">
					<u-gap></u-gap>
					<u--input placeholder="邀请码" prefixIcon="fingerprint" prefixIconStyle="font-size:40rpx"
						customStyle="padding:15rpx 0 0 0" border="bottom" v-model="inviteCode">
					</u--input>
				</view>
			</view>
			<u-row justify="space-between"
				customStyle="margin-top:20rpx;font-weight:bold;font-size:30rpx;color:#414141">
				<text @click="isLogin=!isLogin">{{isLogin?'注册':'登录'}}</text>
				<text @click="isForget=true">忘记密码？</text>
			</u-row>
			<view style="margin-top:20rpx">
				<u-row>
					<u-checkbox-group>
						<u-checkbox @change="accept=!accept" v-model="accept" activeColor="#85a3ff" size="15"
							shape="circle"></u-checkbox>
					</u-checkbox-group>
					<u-row customStyle="font-size:30rpx">
						<text>登录及代表你同意</text>
						<text style="color:#85a3ff">《用户协议》</text>
						<text>与</text>
						<text style="color:#85a3ff">《隐私政策》</text>
					</u-row>
				</u-row>
			</view>

			<view style="margin-top: 20rpx;">
				<u-button :text="isLogin?'登录':'注册'" shape="circle" :hairline="false" color="#85a3ff" size="normal"
					loading-size="10" customStyle="width:300rpx; height:70rpx;box-shadow:0 0 9rpx 0 #85a3ff"
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
		<view style="margin: 40rpx;margin-top: 20rpx;" v-show="isForget">
			<u-text text="找回密码" size="17" bold></u-text>
			<u--input placeholder="用户名" prefixIcon="email" prefixIconStyle="font-size:40rpx"
				customStyle="padding:15rpx 0 0 0" border="bottom" v-model="account">
			</u--input>
			<u-gap></u-gap>
			<u--input placeholder="修改密码" type="password" prefixIcon="lock" prefixIconStyle="font-size:40rpx"
				customStyle="padding:15rpx 0 0 0" border="bottom" v-model="password">
			</u--input>
			<u-gap></u-gap>
			<u-row customStyle="border-bottom:1rpx solid #dadbde">
				<u--input placeholder="验证码" type="number" prefixIcon="fingerprint" prefixIconStyle="font-size:40rpx"
					customStyle="padding:15rpx 0 0 0" border="none" v-model="code">
				</u--input>
				<view>
					<u-code ref="uCode1" @change="codeChange" seconds="120"></u-code>
					<u-button @tap="getAllCode" plain color="#85a3ff" size="mini">{{tips}}</u-button>
				</view>

			</u-row>

			<u-row justify="space-between"
				customStyle="margin-top:20rpx;font-weight:bold;font-size:30rpx;color:#414141">
				<text @click="isForget=false">返回登录</text>
			</u-row>
			<view style="margin-top:20rpx">
				<u-row>
					<u-checkbox-group>
						<u-checkbox @change="accept=!accept" v-model="accept" activeColor="#85a3ff" size="15"
							shape="circle"></u-checkbox>
					</u-checkbox-group>
					<u-row customStyle="font-size:30rpx">
						<text>登录及代表你同意</text>
						<text style="color:#85a3ff">《用户协议》</text>
						<text>与</text>
						<text style="color:#85a3ff">《隐私政策》</text>
					</u-row>
				</u-row>
			</view>
			<view style="margin-top: 40rpx;">
				<u-button text="确认" :hairline="false" color="#85a3ff" loading-size="10"
					customStyle="width:300rpx; height:80rpx;border-radius:10rpx;box-shadow:0 0 9rpx 0 #85a3ff"
					@click="resetPassword()"></u-button>
			</view>
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
				config: {},
				username: '',
				account: '',
				password: '',
				password2: '',
				email: '',
				code: '',
				inviteCode: '',
				isLogin: true,
				isForget: false,
				tips: '',
				accept: false,
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
		created() {
			this.getConfig()
		},
		computed: {

		},
		methods: {
			...mapMutations(['setToken', 'setUser', 'setUserMeta']),
			codeChange(text) {
				this.tips = text
			},
			getConfig() {
				this.$http.get('/user/regConfig').then(res => {
					if (res.data.code == 200) {
						this.config = res.data.data
					}
				})
			},
			getAllCode() {
				if (!this.account.length) {
					uni.$u.toast('账号为空');
					return;
				}
				if (this.$refs.uCode1.canGetCode) {
					this.$http.get('/user/resetPassword', {
						params: {
							account: this.account,
							password: this.password,
							code: this.code,
						}
					}).then(res => {
						if (res.data.code == 200) {
							this.$refs.uCode1.start();
						}
						uni.$u.toast(res.data.msg)

					})
				}
			},
			resetPassword() {
				if (!this.accept) {
					uni.$u.toast('请同意协议')
					return;
				}
				this.$http.get('/user/resetPassword', {
					params: {
						account: this.account,
						password: this.password,
						code: this.code
					}
				}).then(res => {
					if (res.data.code == 200) {
						if (this.code == null && !this.code) {
							uni.$u.toast(res.data.msg)
							return
						}
						uni.$u.toast('已重置密码，即将自动登录')
						setTimeout(() => {
							this.login()
						}, 2000)
					}
				})
			},
			login() {
				if (!this.account.length) {
					uni.$u.toast('请填写账号')
					return
				}
				if (!this.password.length) {
					uni.$u.toast('请填写密码')
					return
				}
				if (!this.accept) {
					uni.$u.toast('请同意协议')
					return
				}
				this.$http.get('/user/login', {
					params: {
						account: this.account,
						password: this.password,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.setToken(res.data.data.token);
						this.getUserInfo(res.data.data.uid);
						this.getUserMeta()
						uni.$emit('login', true)
						this.$store.commit('loginStatus')
						//保存账号密码 用于持久登录
						let account = {
							name: this.account,
							password: this.password
						}
						uni.setStorageSync('account', account)
						setTimeout(() => {
							this.$Router.back(1)
						}, 2000)
					}
					uni.$u.toast(res.data.msg)
				}).catch(err => {
					console.log(err)
				})
			},
			getUserInfo(uid) {
				this.$http.get('/user/userInfo', {
					params: {
						id: uid
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.setUser(res.data.data);
					}
				})
			},
			getUserMeta() {
				this.$http.get('/user/userData', {}).then(res => {
					if (res.data.code == 200) {
						this.setUserMeta(res.data.data)
					}
				})
			},
			register() {
				if (!this.username.length) {
					uni.$u.toast('用户名为空')
					return;
				}
				if (!this.email.length) {
					uni.$u.toast('请填写邮箱')
					return;
				}
				if (this.password.length < 8) {
					uni.$u.toast('密码强度不合格')
					return;
				}

				if (!this.config.isEmail && this.password != this.password2) {
					uni.$u.toast('两次密码不相同')
					return;
				}
				if (this.config.isEmail && this.code.length < 6) {
					uni.$u.toast('验证码错误')
					return;
				}
				if (this.config.isInvite && !this.inviteCode.length) {
					uni.$u.toast('邀请码不可为空')
					return;
				}
				this.$http.get('/user/register', {
					params: {
						account: this.username,
						password: this.password,
						mail: this.email,
						code: this.code,
						inviteCode: this.inviteCode
					}
				}).then(res => {
					if (res.data.code) {
						uni.$u.toast(res.data.msg + '即将自动登录')
						this.account = this.username
						setTimeout(() => {
							this.login()
						}, 800)
					}
				})
			},
			getCode() {
				if (!this.email.length) {
					uni.$u.toast('邮箱为空');
					return;
				}
				if (this.$refs.uCode.canGetCode) {
					this.$http.get('/user/regCodeSend', {
						params: {
							mail: this.email
						}
					}).then(res => {
						if (res.statusCode == 200) {
							uni.$u.toast(res.data.msg)
							setTimeout(() => {
								this.$refs.uCode.start()
							}, 2000)
						}
					})
				}
			},

			start() {

			},
			end() {

			}

		}
	}
</script>

<style lang="scss">

</style>