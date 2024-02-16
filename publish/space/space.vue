<template>
	<view>
		<u-navbar autoBack title="发布动态" placeholder>
			<view slot="left">
				<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="right">
				<u-button shape="circle" style="height: 50rpx;" color="#ff0800" :throttleTime="1000"
					@click="save()">发布</u-button>
			</view>
		</u-navbar>
		<view style="margin: 30rpx;">
			<editor @ready="onEditorReady" id="editor" :adjust-position="false" placeholder="说点什么"></editor>
		</view>
		<view style="margin: 30rpx;" id="album">
			<u-upload :fileList="images" @afterRead="afterRead" @delete="deletePic" name="photo" multiple :maxCount="9"
				:width="(albumWidth/3)-8" :height="(albumWidth/3)-8"></u-upload>
		</view>
		<view style="position: absolute; bottom: 0; width: 100%;background: #fff;"
			:style="{ transform: `translateY(${-keyboardHeight}px)`, transition: '0.3s ease' }">
			<view style="border-top: #ff08000a solid 1rpx;padding: 30rpx;">
				<view>
					<i class="ess icon-emoji_line" style="font-size: 50rpx;" @click="showItem('emoji')"></i>
				</view>
				<view id="emoji">
					<view v-show="itemName =='emoji'" style="height: 100%;width: 100%;">
						<block v-for="(one,oneIndex) in emojiData" :key="oneIndex">
							<swiper style="height: 220rpx;" v-show="emojiIndex == oneIndex">
								<swiper-item v-for="(two,twoIndex) in one.list" :key="twoIndex">
									<u-row customStyle="flex-wrap:wrap">
										<image :src="one.base+one.slug+'_'+three+'.'+one.format"
											v-for="(three,key) in two" :key="key" mode="aspectFill"
											style="margin: 10rpx;"
											:style="{width:(elWidth/6)-(5*3)+'px',height:(elWidth/6)-(5*3)+'px'}"
											@click="insertEmoji(one.base,one.name,one.slug,three,one.format,key)">
										</image>
									</u-row>
								</swiper-item>
							</swiper>
						</block>
						<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#ff0800"
							itemStyle="height: 26px;"
							:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
							:inactiveStyle="{color: '#606266',transform: 'scale(1)'}"
							@change="emojiIndex = $event.index" style="position: static;"
							v-if="itemName=='emoji'"></u-tabs>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		router
	} from '../../router';
	export default {
		data() {
			return {
				images: [],
				editorCtx: null,
				keyboardHeight: 0,
				itemName: '',
				emojiIndex: 0,
				emojiData: [],
				elWidth: 0,
				albumWidth: 0,
			};
		},
		created() {
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
			this.formatEmoji()
		},
		onReady() {
			uni.createSelectorQuery().select('#emoji').boundingClientRect(data => {
				this.elWidth = data.width
				console.log(data.width)
			}).exec()
			uni.createSelectorQuery().select('#album').boundingClientRect(data => {
				this.albumWidth = data.width
				console.log(data.width)
			}).exec()
		},
		methods: {
			showItem(item) {
				if (this.itemName != item) {
					this.itemName = item
				} else {
					this.itemName = null

				}
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
			formatEmoji() {
				// 处理后的数据
				let result = [];

				// 每页表情对象的数量
				const pageSize = 12;

				// 遍历原始数据中的每个 item
				this.$emoji.data.forEach(item => {
					// 构建一个新的 item 对象
					let newItem = {
						"name": item.name,
						"slug": item.slug,
						"base": item.base,
						"format": item.format,
						"list": []
					};
					// 遍历原始数据中的每个子列表
					let page = 1;
					let pageList = {}; // 用于存储每一页的表情对象
					Object.entries(item.list).forEach(([key, value]) => {
						// 将表情对象添加到当前页的列表中
						pageList[key] = value;

						// 如果达到一页的数量，将当前页列表添加到 newItem 的 list 中，重置页码和列表
						if (Object.keys(pageList).length === pageSize) {
							newItem.list.push(pageList);
							page++;
							pageList = {};
						}
					});

					// 添加最后一页的表情对象，如果不为空的话
					if (Object.keys(pageList).length > 0) {
						newItem.list.push(pageList);
					}

					// 将新的 item 添加到结果数组中
					result.push(newItem);
				});

				this.emojiData = result;

			},
			insertEmoji(base, name, slug, emoji, format, key) {
				this.editorCtx.insertImage({
					src: base + slug + '_' + emoji + '.' + format,
					alt: name + '_' + key + '_' + 'emoji',
					width: '50px',
					height: '50px',
					data: {
						name: name,
						emoji: emoji,
						format: format
					},

				})
			},
			deletePic(event) {
				this.images.splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let imagesLength = this.images.length
				lists.map((item) => {
					this.images.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this.images[imagesLength]
					this.images.splice(imagesLength, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					imagesLength++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath: url,
						name: 'file' 
					}).then(res => {
						if (res.data.code) {
							resolve(res.data.data.url)
						}
					})
				})
			},
			save() {
				this.editorCtx.getContents({
					success: (res) => {
						if (res.html.length < 20) {
							uni.$u.toast('再多说点吧~')
							return;
						}
						let html = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `[${alt}]`;
							});
						let images = [];
						images = this.images.map(img => img.url)
						uni.showLoading({
							mask: true,
							title: '发布中...'
						})
						this.$http.post('/space/addSpace', {
							text: html,
							type: 0,
							toid: 0,
							pic: images,
						}).then(res => {
							if (res.data.code) {
								uni.hideLoading();
								uni.$u.toast(res.data.msg)
								setTimeout(() => {
									this.$Router.back(1)
								}, 800)
							}
							console.log(res)
						}).catch(err => {
							uni.hideLoading();
							uni.$u.toast(res.data.msg)
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.ql-container ::v-deep .ql-blank::before {
		font-style: normal;
		color: #999;
	}

	.ql-container ::v-deep img {
		margin: 20rpx auto;
		border-radius: 20rpx;
		max-width: 80%;
	}
</style>