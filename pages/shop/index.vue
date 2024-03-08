<template>
	<z-paging ref="paging" v-model="product" @query="getData">
		<template #top>
			<u-navbar :title="appInfo && appInfo.currencyName+'商城'" bgColor="transparent" placeholder autoBack>
				<view slot="left" style="display:flex;align-items: center;">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
				<view slot="right">
					<i class="ess mgc_search_3_line" style="font-size: 40rpx;" @click="showSearch= !showSearch"></i>
				</view>
			</u-navbar>
		</template>

		<uv-waterfall ref="waterfall" v-model="product" :add-time="10" :left-gap="leftGap" :rightGap="rightGap"
			:column-gap="columnGap" @changeList="changeList">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list1" :key="item.id" :style="[imageStyle(item)]" class="waterfall"
						@click="goProduct(item)">
						<image :src="item.imgurl&&item.imgurl[0]" mode="widthFix"
							:style="{width:item.width+'px',maxHeight:item.height>720?720:item.height+'px'}"
							style="border-radius: 20rpx 20rpx 0 0 ;">
						</image>
						<view style="margin: 20rpx;">
							<text class="u-line-2">{{item.title}}</text>
							<view style="margin-top: 20rpx;display: flex;justify-content: space-between;">
								<view style="display: flex;align-items: baseline;color: red;">
									<i class="ess mgc_coin_line" style="font-size: 26rpx;margin-right: 10rpx;"></i>
									<text>{{item.price}}</text>
								</view>
								<view style="font-size: 26rpx;">
									<text>剩余{{item.num}}件</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<!-- 第二列数据 -->
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list2" :key="item.id" :style="[imageStyle(item)]" class="waterfall"
						@click="goProduct(item)">
						<image :src="item.imgurl && item.imgurl[0]" mode="widthFix"
							:style="{width:item.width+'px',maxHeight:item.height>720?720:item.height+'px'}"
							style="border-radius: 20rpx 20rpx 0 0 ;">
						</image>
						<view style="margin: 20rpx;">
							<text class="u-line-2">{{item.title}}</text>
							<view style="margin-top: 20rpx;display: flex;justify-content: space-between;">
								<view style="display: flex;align-items: baseline;color: red;">
									<i class="ess mgc_coin_line" style="font-size: 26rpx;margin-right: 10rpx;"></i>
									<text>{{item.price}}</text>
								</view>
								<view style="font-size: 26rpx;">
									<text>剩余{{item.num}}件</text>
								</view>

							</view>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
	</z-paging>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				showSearch: false,
				product: [],
				list1: [],
				list2: [],
				columnGap: 6,
				leftGap: 6,
				rightGap: 6

			};
		},
		computed: {
			...mapState(['appInfo']),
			imageStyle(item) {
				return item => {
					const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
					const w = v / 2;
					const rate = w / item.w;
					const h = rate * item.h;
					return {
						width: w + 'px',
						height: h + 'px'
					}
				}
			}
		},

		methods: {
			getData(page, limit) {
				this.$http.get('/shop/list', {
					params: {
						page,
						limit,
					}
				}).then(res => {

					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			changeList(e) {
				this[e.name].push(e.value);
			},
			goProduct(data) {
				this.$Router.push({
					path: '/pages/shop/product_detail',
					query: {
						id: data.id
					}
				})
			}
		}

	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}

	.search {
		transform: translateY(10);
		transition: 0.6s ease;
	}

	.waterfall {
		background: #fff;
		margin-top: 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}
</style>