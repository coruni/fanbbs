<template>
	<view>
		<u-navbar title="发布商品" placeholder autoBack>
			<view slot="left">
				<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		
		<view style="margin: 30rpx;">
			
			<u-input v-model="shop.title" border="bottom" maxlength="40" placeholder="商品标题" :placeholderStyle="{padding:0}" style="padding: 10rpx 0rpx;"></u-input>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shop: {
					title: null,
					text: null,
					price: null,
					num: 0,
					vipDiscount: 1,
					sort: 0,
					type: 1,
				}
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {

			},
			addProduct() {
				this.$http.post('/shop/addShop', {
					params: JSON.stringify(shop)
				}).then(res => {
					console.log()
				})
			}
		}
	}
</script>

<style>

</style>