<template>
	<view>
		<u-navbar autoBack placeholder id="navbar">
			<view slot="center">
				<text>发布帖子</text>
			</view>
			<u-button plain color="#a899e6" slot="right" size="mini" customStyle="font-size:30rpx">草稿箱</u-button>
		</u-navbar>
		<view style="padding:20rpx 30rpx 0rpx 30rpx;" id="inputTitle">
			<u-input placeholder="标题 (必填)" border="none"
				customStyle="padding-bottom:10rpx;border-bottom:2rpx solid #f1f1f1"></u-input>
		</view>
		<editor :adjust-position="false" placeholder="灵感迸发" id="editor" @ready="onEditorReady"
			style="width: 100%;padding:10rpx 30rpx 0rpx 30rpx;"
			:style="{height:editorHeight - keyboardHeight - toolbarHeight-2 +'px'}">
		</editor>
		<view id="toolbar" style="background: #fff;padding: 10rpx 30rpx; 0rpx 30rpx">
			<u-row justify="space-between">
				<text>选择发布位置</text>
				<u-icon name="arrow-right" color="#999"></u-icon>
			</u-row>
			<view style="padding-top: 30rpx;padding-bottom: 20rpx;">
				<u-row>
					<u-row>
						<text>参与话题</text>
						<u-icon name="play-right-fill" size="14" color="#999"></u-icon>
					</u-row>
					<scroll-view scroll-x
						style="overflow: hidden;overflow-x: scroll;white-space: nowrap;margin-left: 20rpx;">
						<u-row>
							<block v-for="item in 20 ">
								<view style="margin-right: 20rpx;background: #f7f7f7;padding:4rpx 20rpx;border-radius: 10rpx;">
									item
								</view>
							</block>
						</u-row>
					</scroll-view>
				</u-row>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				editorCtx: null,
				keyboardHeight: 0,
				editorHeight: 0,
				toolbarHeight: 0,
				article: {
					title: '',
					text: '',
				}
			}
		},
		onReady() {
			this.editorHeight = uni.getSystemInfoSync().windowHeight
			// 去除导航高度
			uni.createSelectorQuery().in(this).select('#navbar').boundingClientRect(data => {
				this.editorHeight -= data.height
			}).exec()
			uni.createSelectorQuery().in(this).select('#inputTitle').boundingClientRect(data => {
				this.editorHeight -= data.height
			}).exec()
			// 监听键盘高度
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
			// 获取工具栏高度
			uni.createSelectorQuery().in(this).select('#toolbar').boundingClientRect(data => {
				this.toolbarHeight = data.height
			}).exec()

		},
		onLoad() {},
		methods: {
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
				// #endif

				// #ifdef APP-PLUS || H5 ||MP-WEIXIN
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					console.log(this.editorCtx)
				}).exec()
				// #endif
			},
		}
	}
</script>

<style>
	page {
		background: #f7f7f7;
	}
</style>