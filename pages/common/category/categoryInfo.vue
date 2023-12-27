<template>
	<view>
		<z-paging refresher-only @onRefresh="onRefresh" ref="paging" @scroll="onScroll">
			<template #top>
				<u-navbar autoBack
					:bgColor="info.opt&& info.opt.primary?$u.colorToRgba(info.opt && info.opt.primary,opacity):$u.colorToRgba('#fff',opacity)"
					fixed>
					<view slot="left">
						<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
			</template>
			<view class="info" id="infoPanel" style="position: relative;top: 0;">
				<image :src="info.opt && info.opt.background?info.opt.background:info.imgurl" mode="aspectFill"
					style="width: 100%;height: 600rpx;">
				</image>
				<view
					:style="`position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: ${info.opt && $u.colorToRgba(info.opt.primary,0.4)};`">
					<view class="info_lay">
						<view style="margin:30rpx;margin-bottom: 60rpx;">
							<u-row align="top">
								<image :src="info.imgurl" mode="aspectFill"
									style="height: 160rpx;width: 160rpx;border-radius: 20rpx;background-color: #f7f7f7;">
								</image>

								<view style="display: flex;flex-direction: column;margin-left: 30rpx;">
									<text style="font-size: 36rpx;"
										:style="{color: info && info.opt && info.opt.background?'white':'black'}">{{info.name}}</text>
								</view>
							</u-row>
							<view style="margin-top: 30rpx;">
								<text
									:style="{color:info.opt&&info.opt.color?info.opt&&info.opt.color:'white'}">{{info.description}}</text>
							</view>
							<view style="margin-top: 30rpx;">
								<u-button shape="circle" :color="info.opt&& info.opt.primary?info.opt.primary:'#000'"
									:customStyle="{color:info.opt&&info.opt.color?info.opt&&info.opt.color:'#fff'}">加入</u-button>
							</view>
						</view>
					</view>
				</view>
				<view style="position: absolute;bottom: 0;width: 100%;border-radius: 40rpx 40rpx 0 0;">
					<view :style="{background:info.opt && info.opt.primary?info.opt && info.opt.primary:'#fff'}"
						style="border-radius: 40rpx 40rpx 0 0;padding: 15rpx;background: red;"></view>
				</view>
			</view>
			<!-- #ifndef APP -->
			<u-sticky :bgColor="info.opt&& info.opt.primary?info.opt && info.opt.primary:'#fff'">
				<u-tabs :list="list" :current="tabsIndex" @change="tabsIndex = $event.index" style="margin: 0 15rpx;"
					:lineColor="info.opt&& info.opt.underline"></u-tabs>
			</u-sticky>
			<!-- #endif -->
			<!-- #ifdef APP -->
			<u-sticky :bgColor="info.opt&& info.opt.primary?info.opt && info.opt.primary:'#fff'" offsetTop="60">
				<u-tabs :list="list" :current="tabsIndex" @change="tabsIndex = $event.index" style="margin: 0 15rpx;"
					:lineColor="info.opt&& info.opt.underline"></u-tabs>
			</u-sticky>
			<!-- #endif -->
			<view :style="{background:info.opt && info.opt.primary?info.opt && info.opt.primary:'#fff'}">

				<swiper :style="{height:windowHeight+'px'}" :current="tabsIndex"
					@animationfinish="tabsIndex = $event.detail.current">
					<swiper-item v-if="id">
						<hot-article :mid="id" :isScroll="isScroll" ref="hot"
							:border="info.opt&& info.opt.underline?info.opt&& info.opt.underline:'#f7f7f7'"></hot-article>
					</swiper-item>
					<swiper-item v-if="id">
						<new-article :mid="id" :isScroll="isScroll" ref="new"
							:border="info.opt&& info.opt.underline?info.opt&& info.opt.underline:'#f7f7f7'"></new-article>
					</swiper-item>
				</swiper>
			</view>
		</z-paging>
	</view>
</template>
<script>
	import hotArticle from './components/hot.vue';
	import newArticle from './components/new.vue';
	export default {
		components: {
			hotArticle,
			newArticle
		},
		data() {
			return {
				id: 0,
				info: {},
				isScroll: false,
				isSticky: false,
				panelHeight: 0,
				platform: '',
				opacity: 0,
				tabsIndex: 0,
				list: [{
						name: '热门'

					},
					{
						name: '最新'
					}
				],
				windowHeight: 0,
			};
		},
		onLoad(params) {
			this.id = params.id
			this.getData(params.id)
			this.platform = uni.getSystemInfoSync().uniPlatform
		},
		onReady() {
			this.$nextTick(() => {
				uni.createSelectorQuery().in(this).select("#infoPanel").boundingClientRect(data => {
					this.panelHeight = data.height
					console.log(data.height)
				}).exec()
			}, 200)

		},
		created() {
			this.windowHeight = uni.getSystemInfoSync().windowHeight
		},
		methods: {
			getData(id) {
				this.$http.get('/category/info', {
					params: {
						key: id
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.info = res.data.data
						console.log(uni.$u.hexToRgb(this.info.opt.primary))
					}
				})
			},
			onRefresh() {
				switch (this.tabsIndex) {
					case 0:
						this.$refs.hot.reload()
						break;
					case 1:
						this.$refs.new.reload()
					default:
						break;
				}
				setTimeout(() => {
					this.$refs.paging.complete()
				}, 1000)
			},
			onScroll(data) {
				let scrollTop = data.detail.scrollTop
				this.opacity = scrollTop / 100;
				if (scrollTop > this.panelHeight - 44 - (this.platform == 'app' ? 45 : 0)) {
					this.isScroll = true;
					this.isSticky = true;
				} else {
					this.isSticky = false;
					this.isScroll = false;
				}
			}
		}
	}
</script>

<style lang="scss">
	.info {
		position: relative;
		top: 0;
		height: 600rpx;

		&_lay {
			position: absolute;
			bottom: 0;
			width: 100%;
		}
	}
</style>