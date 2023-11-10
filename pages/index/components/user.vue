<template>
	<z-paging @query="getData" ref="paging">
		<image :src="userInfo.avatar" mode="aspectFill" style="width: 100%;height: 380rpx;background: #000;"></image>
		<view style="position: relative;top: -50rpx;background: #fff;border-radius: 40rpx 40rpx 0 0;">
			<u-avatar :src="userInfo.avatar" size="80"
				customStyle="position:absolute;top:-80rpx;margin-left:60rpx;border:6rpx solid #fff"></u-avatar>
			<u-row justify="end" customStyle="padding:20rpx">
				<view>
					<u-button color="#FB7299C4" plain size="normal"
						customStyle="height:50rpx;border-radius:20rpx">个人资料</u-button>
				</view>
			</u-row>
			<view style="margin:20rpx">
				<u-row>
					<text :style="{color:userInfo.isVip?'#FB7299':'',fontSize:58+'rpx'}">{{userInfo.screenName}}</text>
					<u-text :text="'Lv.'+ userInfo.lv" size="10" color="white"
						customStyle="margin-left:10rpx;background:#FB7299;padding:0 10rpx;border-radius:8rpx;box-shadow:0 0 9rpx 0 #FB7299"></u-text>
				</u-row>
				<u-icon name="checkmark-circle-fill" label="管理员" color="red"
					v-if="userInfo.group=='administrator'"></u-icon>
				{{userInfo}}
			</view>
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

			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				this.getData()
			},
			getData() {
				
				this.$http.get('/typechoUsers/userInfo', {
					params: {
						key: this.userInfo.uid
					}
				}).then(res => {
					console.log(res)

				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>
</style>