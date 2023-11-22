<template>
	<view class="next-modal" @touchmove.stop.prevent="bindTouchmove" :class="{'next-modal--show':isOpen}">
		<view class="next-modal__mask" @click="clickMask"></view>
		<view class="next-modal__container">
			<template v-if="$slots.title">
				<slot name="title" />
			</template>
			<template v-else>
				<view class="next-modal__header" v-if="title.length > 0">{{title}}</view>
			</template>
			<view class="next-modal__content" :class="content ? 'next-modal--padding' : ''">
				<template v-if="$slots.default || $slots.content">
					<view><slot name="content" /></view>
					<view><slot /></view>
				</template>
				<template  v-else>
					<view :style="{textAlign:align}">
						<text class="modal-content">{{content}}</text>
					</view>
				</template>
			</view>
			<view class="next-modal__footer">
				<template v-if="$slots.footer">
					<slot name="footer" />
				</template>
				<template v-else>
					<view v-if="showCancel" class="next-modal__footer-left" @click="clickLeft" :style="{color:cancelColor}"
						hover-class="next-modal__footer-hover" :hover-start-time="20" :hover-stay-time="70">
						{{cancelText}}
					</view>
					<view class="next-modal__footer-right" @click="clickRight" :style="{color:confirmColor}"
						hover-class="next-modal__footer-hover" :hover-start-time="20" :hover-stay-time="70">
						{{confirmText}}
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'next-modal',
		props: {
			title: { //标题
				type: String,
				default: ''
			},
			content: String, //提示的内容
			align: {
				type: String,
				default: 'left'
			},
			cancelText: { //取消按钮的文字，默认为"取消"
				type: String,
				default: '取消'
			},
			cancelColor: { //取消按钮颜色
				type: String,
				default: '#333333'
			},
			confirmText: { //确定按钮的文字，默认为"确定"
				type: String,
				default: '确定'
			},
			confirmColor: { //确认按钮文字颜色
				type: String,
				default: '#f0ad4e'
			},
			showCancel: { //是否显示取消按钮，默认为 true
				type: [Boolean, String],
				default: true
			},
			show: { //是否显示模态框
				type: [Boolean, String],
				default: false
			},
			autoClose: { //点击遮罩是否自动关闭弹窗
				type: [Boolean, String],
				default: true
			}
		},
		data() {
			return {
				isOpen: false
			}
		},
		created() {
			this.$watch(() => this.show, (val) => {
				this.isOpen = val
			})
		},
		methods: {
			bindTouchmove() {},
			clickLeft() {
				setTimeout(() => {
					this.$emit('cancel')
				}, 200)
			},
			clickRight() {
				setTimeout(() => {
					this.$emit('confirm')
				}, 200)
			},
			clickMask() {
				if (this.autoClose) {
					this.closeModal()
				}
			},
			closeModal() {
				this.showAnimation = false
				this.isOpen = false
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss">
	$bg-color-mask: rgba(0, 0, 0, 0.5); //遮罩颜色
	$bg-color-hover: #f1f1f1; //点击状态颜色

	.next-modal {
		position: fixed;
		visibility: hidden;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 1000;
		transition: visibility 200ms ease-in;

		&.next-modal--show {
			visibility: visible;
		}

		&__header {
			position: relative;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			padding: 18upx 24upx;
			line-height: 1.5;
			color: #333;
			font-size: 32upx;
			text-align: center;

			&::after {
				content: " ";
				position: absolute;
				left: 0;
				bottom: 0;
				right: 0;
				height: 1px;
				border-top: 1px solid #e5e5e5;
				transform-origin: 0 0;
				transform: scaleY(.5);
			}
		}

		&__container {
			position: absolute;
			z-index: 999;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: transform 0.3s;
			width: 540upx;
			border-radius: 20upx;
			background-color: #fff;
			overflow: hidden;
			opacity: 0;
			transition: opacity 200ms ease-in;
		}

		&__content {
			position: relative;
			color: #333;
			font-size: 28upx;
			box-sizing: border-box;
			line-height: 1.5;

			&::after {
				content: " ";
				position: absolute;
				left: 0;
				bottom: -1px;
				right: 0;
				height: 1px;
				border-bottom: 1px solid #e5e5e5;
				transform-origin: 0 0;
				transform: scaleY(.5);
			}
		}

		&__footer {
			position: relative;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #333;
			font-size: 32upx;
			display: flex;
			flex-direction: row;

			&-left,
			&-right {
				position: relative;
				flex: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				height: 88upx;
				font-size: 28upx;
				line-height: 88upx;
				text-align: center;
				background-color: #fff;
				color: #333;
			}

			&-right {
				color: #007aff;
			}

			&-left::after {
				content: " ";
				position: absolute;
				right: -1px;
				top: 0;
				width: 1px;
				bottom: 0;
				border-right: 1px solid #e5e5e5;
				transform-origin: 0 0;
				transform: scaleX(.5);
			}

			&-hover {
				background-color: $bg-color-hover;
			}
		}

		&__mask {
			display: block;
			position: absolute;
			z-index: 998;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: $bg-color-mask;
			opacity: 0;
			transition: opacity 200ms ease-in;

			&.next-modal--show {
				opacity: 1;
			}
		}

		&--padding {
			padding: 32upx 24upx;
			min-height: 90upx;
		}

		&--show {

			.next-modal__container,
			.next-modal__mask {
				opacity: 1;
			}
		}
	}
</style>