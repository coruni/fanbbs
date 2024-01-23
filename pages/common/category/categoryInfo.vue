<template>
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
		<!-- 背景 -->
		<view id="infoPanel" style="position: relative;height: 240px;">
			<view :style="{backgroundImage:`url(${info.opt && info.opt.background})`}" class="backCover">
			</view>
			<view style="margin: 30rpx;position: absolute;top: 100rpx;">
				<u-row>
					<u-image :src="info.imgurl" width="60" height="60" radius="15"
						style="border-radius: 20rpx;"></u-image>
					<view
						style="display: flex;
						flex-direction: column;
						margin-left: 20rpx;
						color: white;
						justify-content: space-between;
						">
						<text>{{info.name}}</text>
						<text style="font-size: 26rpx;">{{info.description}}</text>
					</view>
				</u-row>

			</view>
			<view style="position: absolute;bottom: 0;width: 100%;">
				<view style="width: 100%;height: 44rpx;border-radius: 20rpx 20rpx 0 0;"
					:style="{background:info.opt && info.opt.primary?info.opt.primary:'#fff'}">
				</view>
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
				<swiper-item v-for="(item,index) in list" :key="index" style="overflow: auto;">
					<articleItem :mid="id" :isScroll="isScroll" :order="item.order" :random="item.random" ref="article"
						:border="info.opt&& info.opt.underline?info.opt&& info.opt.underline:'#f7f7f7'"></articleItem>
				</swiper-item>
			</swiper>
		</view>
	</z-paging>

</template>
<script>
	import articleItem from './components/article.vue';
	export default {
		components: {
			articleItem,
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
						name: '热门',
						order: 'likes desc,replyTime desc,text desc,views desc,created desc',
						random: true,

					},
					{
						name: '最新',
						order: 'created desc',
						random: false,
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

		created() {
			this.windowHeight = uni.getSystemInfoSync().windowHeight
		},
		methods: {
			getData(id) {
				this.$http.get('/category/info', {
					params: {
						id
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.info = res.data.data
					}
				})
			},
			onRefresh() {
				setTimeout(() => {
					this.$refs.paging.complete()
				}, 1000)
			},
			onScroll(data) {
				let scrollTop = data.detail.scrollTop
				this.opacity = scrollTop / 100;
				if (scrollTop > 240 - 44 - (this.platform == 'app' ? 45 : 0)) {
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
	.backCover {
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
		filter: blur(2px);
	}

	.backCover::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>