<template>
	<view class="next-bubble-menu" 
	>
		<view @click.stop="showContainer">
			<slot></slot>
		</view>
		<view class="container" v-show="show && showUi">
			<view class="block" :style="{top:top+'rpx'}">
				<view class="arrow"
					:style="{
						left:0,
						top: showTop && (arrowTop+12)+'rpx'
					}">
				</view>
				<view class="arrow-tip"
					:style="{
						width:width+'rpx',
						left: 0,
						borderRadius:radius+'rpx',
						top: showTop && arrowTop+'rpx'
					}">
				</view>
				<view class="list-container"
					:style="'height:'+(dHeight?dHeight+'rpx':'auto')+';max-height:'+dMaxHeight+'rpx;border-radius:'+radius+'rpx;width:'+width+'rpx;left:'+ relativeAllow +'rpx;'">
					<view class="list-item" v-for="(item,index) in dataList" :key="index" @click.stop="clickItem(item)">
						<image class="list-item-image" :src="item.iconSrc" v-if="item.iconSrc" />
						<text class="list-item-text">{{item.text}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bingEleId: {
				type: String,
				default: ''
			},
			//气泡框数据源
			dataList: {
				type: Array,
				default: () => {
					return []
				}
			},
			hasBar: {
				type: Boolean,
				default: true
			},
			radius: {
				type: Number,
				default: 8
			},
			dWidth: {
				type: Number,
				default: 0
			},
			dHeight: {
				type: Number,
				default: 0
			},
			dMaxHeight: {
				type: Number,
				default: 400
			},
			relativeAllow: {
				type: Number,
				default: -30
			}
		},
		data() {
			return {
				show: false,
				width: 0,
				height: 0,
				left: 0,
				top: 0,
				bottom: 0,
				rectTop: 0,
				screenWidth: 0,
				showTop: false,
				arrowTop: 0,
				showUi: false
			}
		},
		mounted() {
			this.$nextTick(() => {
				if (!this.bingEleId) return
				// #ifdef APP-PLUS
				uni.createSelectorQuery().in(this).select('.next-bubble-menu').boundingClientRect(res => {
					let difference = res.left
					uni.createSelectorQuery().select('#' + this.bingEleId).boundingClientRect(rect => {
						const systemInfo = uni.getSystemInfoSync()
						const windowHeight = systemInfo.windowHeight
						this.screenWidth = systemInfo.screenWidth
						if (!this.dWidth) {
							this.width = this.px2rpx(rect.width, this.screenWidth)
						} else {
							let screenW = this.px2rpx(this.screenWidth, this.screenWidth)
							this.width = this.dWidth > screenW ? screenW : this.dWidth
						}
						this.height = rect.height
						this.rectTop = rect.top
						this.bottom = windowHeight - rect.bottom
						
					}).exec()
				}).exec()
				// #endif
				// #ifndef APP-PLUS
				uni.createSelectorQuery().in(this).select('.next-bubble-menu').boundingClientRect(res => {
					let difference = res.left
					uni.createSelectorQuery().select('#' + this.bingEleId).boundingClientRect(rect => {
						const systemInfo = uni.getSystemInfoSync()
						const windowHeight = systemInfo.windowHeight
						this.screenWidth = systemInfo.screenWidth
						if (!this.dWidth) {
							this.width = this.px2rpx(rect.width, this.screenWidth)
						} else {
							let screenW = this.px2rpx(this.screenWidth, this.screenWidth)
							this.width = this.dWidth > screenW ? screenW : this.dWidth
						}
						this.height = rect.height
						this.rectTop = rect.top
						this.bottom = windowHeight - rect.bottom
					}).exec()
				}).exec()
				// #endif
			})
		},
		methods: {
			showContainer() {
				if (!this.bingEleId) return
				else this.show = !this.show
				if (this.show) {
					this.$nextTick(res => {
						// #ifdef APP-PLUS
						let view = uni.createSelectorQuery().in(this).select(".list-container")
						view.boundingClientRect(res => {
							let arrHeight = res.height
							let height = this.bottom - arrHeight - 15
							if (height < 0) {
								this.showTop = true
								this.top = this.px2rpx((this.rectTop - arrHeight - 10), this
									.screenWidth)
								this.arrowTop = this.px2rpx(arrHeight - 5, this.screenWidth)
							} else {
								this.showTop = false
								this.top = this.px2rpx(this.rectTop + this.height + 10, this
									.screenWidth)
							}
							this.$nextTick(() => {
								this.showUi = true
							})
						}).exec()
						// #endif
						// #ifndef APP-PLUS
						uni.createSelectorQuery().in(this).select('.list-container').boundingClientRect(res => {
							const left = res.left
							let arrHeight = res.height
							let height = this.bottom - arrHeight - 15
							if (height < 0) {
								this.showTop = true
								if (this.hasBar) {
									// #ifdef H5
									this.top = this.px2rpx((this.rectTop - arrHeight + 35), this
										.screenWidth)
									// #endif
									// #ifndef H5
									this.top = this.px2rpx((this.rectTop - arrHeight - 10), this
										.screenWidth)
									// #endif
								} else {
									this.top = this.px2rpx((this.rectTop - arrHeight - 10), this
										.screenWidth)
								}
								this.arrowTop = this.px2rpx(arrHeight - 5, this.screenWidth)
							} else {
								this.showTop = false
								if (this.hasBar) {
									// #ifdef H5
									this.top = this.px2rpx(this.rectTop + this.height + 54, this
										.screenWidth)
									// #endif
									// #ifndef H5
									this.top = this.px2rpx(this.rectTop + this.height + 10, this
										.screenWidth)
									// #endif
								} else {
									this.top = this.px2rpx(this.rectTop + this.height + 10, this
										.screenWidth)
								}
							}
							this.$nextTick(() => {
								this.showUi = true
							})
						}).exec()
						// #endif
					})
				}
			},
			px2rpx(px, screenWidth) {
				return px / (screenWidth / 750)
			},
			//点击选项
			clickItem(item) {
				this.show = false
				this.$emit('change', item)
			}
		}
	}
</script>

<style scoped>
	
	.next-bubble-menu {
		position: relative;
		border: solid transparent 1px;
	}
	
	.block {
		position: fixed;
	}
	.list-container {
		position: absolute;
		box-sizing: border-box;
		z-index: 99999999 !important;
		overflow: auto;
		padding: 16rpx 20rpx;
		background-color: #ffffff;
		box-shadow: 2rpx 4rpx 10rpx rgba(0,0,0,.1);
	}
	.arrow {
		position: absolute;
		z-index: 999999999 !important;
		width: 0;
		height: 0;
		margin-top: -40rpx;
		border-top: 20rpx solid transparent;
		border-bottom: 20rpx solid #ffffff;
		border-right: 20rpx solid transparent;
		border-left: 20rpx solid transparent;
	}

	.arrow-tip {
		position: absolute;
		z-index: 999999999 !important;
		height: 15rpx;
	}

	.list-item {
		line-height: 80rpx;
		color: #333;
	}
	.list-item:after {
		content: ' ';
		display: block;
		height: 1rpx;
		transform: scaleY(0.5);
		background-color: rgba(0,0,0,.1);
	}
	.list-item .list-item-image {
		display: inline-block;
		vertical-align: middle;
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
	.list-item .list-item-text {
		vertical-align: middle;
	}
</style>