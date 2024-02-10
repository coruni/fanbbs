<template>
	<view>
		<z-paging ref="paging" @query="getData" v-model="messages" use-chat-record-mode auto-hide-keyboard-when-chat
			use-page-scroll>
			<template #top>
				<u-navbar placeholder autoBack :title="nickname">
					<view slot="left">
						<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
			</template>
			<view style="margin: 30rpx;"
				:style="{transform: `translateY(${keyboardHeight+'px'})`,transition:'transform 0.3s ease'}">
				<block v-for="(item,index) in messages" :key="index">
					<u-row v-if="item.sender_id != userInfo.uid" align="top"
						style="margin-bottom: 20rpx;transform: scaleY(-1)">
						<u-avatar :src="item.userInfo.avatar"></u-avatar>
						<view
							style="background: #85a3ff32;padding:10rpx;margin-left: 10rpx;border-radius: 20rpx;margin-top: 10rpx;">
							<uv-parse :tagStyle="{img:'border-radius:10px'}" :content="item.text"
								style="word-wrap: normal;flex-wrap: wrap; word-break: break-all;"></uv-parse>
						</view>
					</u-row>
					<u-row v-if="item.sender_id == userInfo.uid" justify="end" align="top"
						style="margin-bottom: 20rpx;transform: scaleY(-1);">
						<view
							style="background: #85a3ff32;padding:10rpx;margin-right: 10rpx;border-radius: 20rpx;margin-top: 10rpx;">
							<uv-parse :tagStyle="{img:'border-radius:10px'}" :content="item.text"
								style="word-wrap: normal;flex-wrap: wrap; word-break: break-all;"></uv-parse>
						</view>
						<u-avatar :src="userInfo.avatar" />
					</u-row>
				</block>
			</view>
			<template #bottom>
				<view style="padding: 30rpx;background: #fff;"
					:style="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.3s ease'}">
					<u-row align="bottom">
						<editor id="editor" @ready="onEditorReady" :adjust-position="false" :show-img-size="false"
							:show-img-resize="false" :show-img-toolbar="false"
							style="background: #85a3ff32;height: auto;min-height: unset;max-height: 100px;border-radius: 20rpx;padding: 8rpx 16rpx;">
						</editor>
						<u-button color="#85a3ff" style="width: 140rpx;height: 60rpx;margin-left: 20rpx;" shape="circle"
							@click="sendMessage()">发送</u-button>
					</u-row>
				</view>
			</template>
		</z-paging>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				nickname: null,
				id: 0,
				receive_id: 0,
				messages: [],
				editorCtx: null,
				keyboardHeight: 0,
				windowHeight: 0,
			}
		},
		onPageScroll(e) {
			if (e.scrollTop <= 0) {
				this.$refs.paging.doChatRecordLoadMore()
			}
		},
		onReady() {
			uni.onKeyboardHeightChange((data) => {
				this.keyboardHeight = data.height
			})
		},
		created() {
			let SystemInfo = uni.getSystemInfoSync()
			this.windowHeight = SystemInfo.windowHeight - SystemInfo.statusBarHeight
		},
		onLoad(params) {
			this.nickname = params.nickname
			this.receive_id = params.receive_id

		},
		onUnload() {
			uni.offKeyboardHeightChange()
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			getData(page, limit) {
				this.$http.post('/chat/chatRecord', {
					page,
					limit: 30,
					id: this.id,
					receive_id: this.receive_id,
					type: 0,
					order: 'created asc'
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			sendMessage() {
				this.editorCtx.getContents({
					success: (res) => {
						// 将消息添加到列表
						this.$refs.paging.addChatRecordData({
							sender_id: this.userInfo.uid,
							text: res.html
						})
						if (!res.text.length) return;
						this.$http.post('/chat/sendMsg', {
							id: this.id,
							receive_id: this.receive_id,
							type: 0,
							text: res.html
						}).then(ress => {
							if (ress.data.code) {
								// 清空编辑器消息
								this.editorCtx.clear()
							}
						})
					}
				})
			},
			shouldDisplayAvatar(index) {
				// 如果是第一条消息，或者当前消息用户与上一条消息用户不同，则显示当前消息用户的头像
				if (index === 0 || this.messages[index].userJson.uid !== this.messages[index - 1].userJson.uid) {
					return this.messages[index].userJson.avatar;
				}

				// 否则不显示头像
				return 'hidden';
			},
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
				// #endif

				// #ifdef APP-PLUS || H5 ||MP-WEIXIN
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
				// #endif
			},
		}
	}
</script>

<style lang="scss">
	.ql-container ::v-deep .ql-blank::before {
		min-height: 60rpx;
		height: 60rpx;
		font-style: normal;
	}
</style>