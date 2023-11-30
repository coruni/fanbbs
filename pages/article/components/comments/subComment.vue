<template>
	<view>
		<z-paging ref="paging" @query="getComments" v-model="comments" :refresher-enabled="false">
			<template #top>
				<u-navbar autoBack placeholder></u-navbar>
			</template>

			<u-row align="top" customStyle="margin:30rpx;border-bottom: 1rpx #f7f7f7 solid;">

				<view style="position: relative;">
					<u-avatar :src="data.avatar" size="30" customStyle="border:4rpx solid #85a3ff32"
						@click="goProfile(data.authorId)"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data.opt&&data.opt.headStatus&&data.opt.head_picture">
					</image>
				</view>
				<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;padding-bottom: 30rpx;">
					<u-row>
						<text
							:style="{color:data.isvip?'#a899e6':'',fontSize:30+'rpx',fontWeight:600}">{{data.author}}</text>
						<text
							style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
							v-if="data.authorId == data.ownerId">作者</text>
					</u-row>
					<view style="margin-top:10rpx;word-break: break-word;">
						<uv-parse :previewImg="false" selectable :showImgMenu="false"
							:content="formatEmoji(data.text)"></uv-parse>
					</view>
					<u-swiper :list="data.images" v-if="data.images && data.images.length" :autoplay="false" indicator
						height="150" indicator-style="left" radius="10"
						@click="previewImg(data.images,$event)"></u-swiper>
					<u-grid :col="3" :border="false" v-if="data.longtext && data.longtext.images">
						<u-grid-item v-for="(image,imageIndex) in data.longtext.images" :key="imageIndex"
							v-if="imageIndex<9" @click.native.stop="preview"
							:customStyle="{width:'210rpx',height:'210rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:'10rpx'}">
							<image :src="image" mode="aspectFill" style="width:210rpx;height:210rpx;border-radius:10rpx"
								class="u-info-light-bg"></image>
						</u-grid-item>
					</u-grid>
					<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
						<text>{{$u.timeFormat(data.created,'mm-dd')}}</text>
						<u-row customStyle="flex-basis:25%" justify="space-between">
							<u-icon name="chat" color="#aaa" size="20" labelColor="#aaa" label-size="12"></u-icon>
							<u-icon name="thumb-up" color="#aaa" size="20" labelColor="#aaa" :label="1"
								label-size="12"></u-icon>
						</u-row>
					</u-row>
				</view>
			</u-row>

			<!-- 子评论开始 -->
			<view>
				<block v-for="(item,index) in comments" :key="index">
					<view style="padding:30rpx">
						<u-skeleton rows="2" avatar :loading="loading">
							<u-row align="top">
								<u-avatar :src="item.avatar" size="24" customStyle="border:4rpx solid #85a3ff32"
									@click="goProfile(item.authorId)"></u-avatar>

								<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
									<u-row>
										<text
											:style="{color:item.isvip?'#a899e6':'',fontSize:30+'rpx',fontWeight:600}">{{item.author}}</text>
										<text
											style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
											v-if="item.authorId == data.ownerId">作者</text>
									</u-row>
									<view style="margin-top:10rpx;word-break: break-word;"
										@click="commentCheck(true,item.coid,item.author)">

										<uv-parse :previewImg="false" selectable :showImgMenu="false"
											:content="item.parent != data.coid&&item.authorId!=item.parentComments.authorId?formatEmoji(formatText(item)):formatEmoji(item.text)"></uv-parse>
									</view>
									<u-swiper :list="item.images" v-if="item.images && item.images.length"
										:autoplay="false" indicator height="150" indicator-style="left" radius="10"
										@click="previewImg(item.images,$event)"></u-swiper>
									<u-grid :col=" 3" :border="false" v-if="item.longtext && item.longtext.images">
										<u-grid-item v-for="(image,imageIndex) in item.longtext.images"
											:key="imageIndex" v-if="imageIndex<9" @click.native.stop="preview"
											:customStyle="{width:'210rpx',height:'210rpx',borderRadius:'20rpx',marginTop:'10rpx',marginRight:'10rpx'}">
											<image :src="image" mode="aspectFill"
												style="width:210rpx;height:210rpx;border-radius:10rpx"
												class="u-info-light-bg">
											</image>
										</u-grid-item>
									</u-grid>
									<u-gap height="6"></u-gap>
									<view>
										<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
											<text>{{$u.timeFormat(item.created,'mm-dd')}}</text>
											<u-row customStyle="flex-basis:30%" justify="space-between">
												<u-icon name="chat" color="#aaa" label="回复" size="20" labelColor="#aaa"
													label-size="12"></u-icon>
												<u-icon name="thumb-up" color="#aaa" :label="1" size="20"
													labelColor="#aaa" label-size="12"></u-icon>

											</u-row>
										</u-row>
									</view>
								</view>
							</u-row>
						</u-skeleton>
					</view>
				</block>
			</view>
			<template #bottom>
				<u-row customStyle="margin:20rpx;" justify="space-between">
					<u-row customStyle="padding:14rpx 14rpx;border-radius: 50rpx;flex:1;background:#85a3ff14"
						class="u-info" @click="commentCheck(false,data.coid,data.author);">
						<u-icon name="edit-pen" size="20"></u-icon>
						<text style="margin-left:10rpx;font-size: 28rpx;">回复{{data.author}}</text>
					</u-row>
				</u-row>
				<!-- 回复评论弹窗 -->

			</template>

		</z-paging>
		<u-popup :show="showComment" @close="showComment = false" round="20"
			:customStyle="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.3s ease-in-out',padding:30+'rpx'}">
			<editor id="editor" :adjust-position="false" :show-img-size="false" :show-img-resize="false"
				:show-img-toolbar="false" @ready="onEditorReady" :placeholder="`回复${replyWho}`"
				style="background: #85a3ff14;height: auto;min-height: 60px;max-height: 100px;border-radius: 20rpx;padding: 8rpx 16rpx;">
			</editor>
			<u-row customStyle="margin-top:20rpx" justify="space-between">
				<u-col span="2">
					<u-row justify="space-between">
						<block v-for="(item,index) in cBtn" :key="index">
							<u-icon :name="item.icon" size="24" :color="showComemntBtn == item.name?'#a899e6':''"
								@click="cBtnTap(item.name)"></u-icon>
						</block>
					</u-row>
				</u-col>
				<view>
					<u-button shape="circle" color="#a899e6" customStyle="padding:4rpx,6rpx;height:50rpx;width:120rpx"
						text="发送" @click="reply"></u-button>
				</view>
			</u-row>
			<uv-scroll-list :indicator="false" v-if="images.length" style="margin-top: 20rpx;">
				<view v-for="(item, index) in images" :key="index"
					style="position: relative; display: inline-block;height: 100rpx;width: 100rpx;margin-right: 10orx;">
					<image :src="item" mode="aspectFill" style="height: 100rpx; width: 100rpx; border-radius: 20rpx;"
						@click="preview(images,index)">
					</image>
					<u-icon name="close-circle" style="position: absolute; top: 0; right: 0;"
						@click="images.splice(index, 1)">
					</u-icon>
				</view>
			</uv-scroll-list>
			<!-- 隐藏面板 -->
			<block v-if="showComemntBtn == '表情'">
				<!-- 这里加表情 -->
				<block v-for="(one,oneIndex) in emojiData" :key="oneIndex">
					<swiper style="height: 120px;" v-show="emojiIndex == oneIndex">
						<swiper-item v-for="(two,twoIndex) in one.list" :key="twoIndex">
							<u-row justify="space-between" customStyle="flex-wrap:wrap">
								<image :src="one.base+one.slug+'_'+three+'.'+one.format" v-for="(three,key) in two"
									:key="key" mode="aspectFill" style="width: 100rpx;height: 100rpx;margin: 10rpx;"
									@click="insertEmoji(one.base,one.name,one.slug,three,one.format,key)"></image>
							</u-row>
						</swiper-item>
					</swiper>
				</block>
				<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#a899e6"
					itemStyle="height: 24px;"
					:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
					:inactiveStyle="{color: '#606266',transform: 'scale(1)'}" @change="emojiIndex = $event.index"
					style="position: static;"></u-tabs>
			</block>
		</u-popup>
		<uv-modal ref="upload" :zIndex="10076" @close="uploadErr.status = false;uploadErr.msg=null;"
			:closeOnClickOverlay="uploadErr.status" :showConfirmButton="false"
			:title="uploadErr.status?'上传错误':'上传中...'">
			<u-line-progress :percentage="percentage" activeColor="#a899e6" :showText="false"
				v-if="!uploadErr.status"></u-line-progress>
			<text v-if="uploadErr.status">错误信息：{{uploadErr.msg}}</text>
			<view slot="confirmButton"></view>
		</uv-modal>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				data: null,
				percentage: 30,
				comments: [],
				images: [],
				pid: 0,
				uploadErr: {
					status: false,
					msg: ''
				},
				keyboardHeight: 0,
				showComment: false,
				showComemntBtn: null,
				commentText: '',
				emojiData: [],
				emojiIndex: 0,
				cBtn: [{
					name: '表情',
					icon: 'heart',
				}, {
					name: '图片',
					icon: 'photo',
				}],
				replyWho: '',
				loading: true,
			}
		},
		beforeRouteLeave(to, from, next) {
			if (this.showComment) {
				this.showComment = false;
				next(false)
				this.$Router.$lockStatus = false
			} else {
				next();
			}

		},
		created() {

			this.formatEmojiData()
		},
		onShow() {
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
		},
		onLoad(params) {
			this.data = uni.getStorageSync('subComment_' + params.id)
		},
		onUnload() {
			// 取消键盘监听
			uni.offKeyboardHeightChange(data => {
				console.log('取消了')
			})

		},
		methods: {
			getComments(page, limit) {
				this.$http.get('/typechoComments/commentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							cid: this.data.cid,
							type: 'comment',
							allparent: this.data.coid,
						}),
						order: 'created asc'
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data)
					}
					setTimeout(() => {
						this.loading = false
					}, 1000)
				})
			},
			commentCheck(status, pid, reply) {
				this.pid = pid
				this.replyWho = reply
				if (!status) this.pid = pid;
				this.showComment = true
			},
			reply() {
				this.editorCtx.getContents({
					success: (res) => {
						this.commentText = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `[${alt}]`;
							});
						if (res.text.length<2) {
							uni.$u.toast('再多说点吧~')
							return;
						};

						let params = JSON.stringify(params = {
							cid: this.data.cid,
							parent: this.pid,
							allparent: this.data.coid,
							text: this.commentText,
							images: this.images
						})

						this.$http.post('/typechoComments/commentsAdd', {
							params
						}).then(res => {
							if (res.data.code) {
								uni.$u.toast('已发送~')
								this.commentText = ''
								this.showComment = false
								this.$refs.paging.reload()
								this.$emit('subReply', true)
							} else {
								uni.$u.toast(res.data.msg)
							}
						})
					}

				})
			},
			formatText(item) {
				let text = `
			    <div style="word-break:break-all">
			      回复&nbsp;
			      <span style="color:#85a3ff" v-on:click="goProfile(item)">
			        ${item.parentComments.author}：</span> 
					${item.text}
			    </div>
			  `;
				return text;
			},
			goProfile(id) {
				console.log('点击了')
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			},
			formatEmoji(html) {
				return html.replace(/\[([^\]]+)_([^\]]+)\]/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name);
					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`;
						return `<img src=".${src}" style="width:80rpx;height:80rpx">`;
					}
					// 如果找不到对应的 emoji，可能需要返回原始的字符串或者给出一些提示
					return match;
				})
			},
			formatEmojiData() {
				// 处理后的数据
				let result = [];

				// 每页表情对象的数量
				const pageSize = 10;

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
			cBtnTap(name) {
				if (name == '图片') {
					this.chooseImage()
					return;
				}
				if (name == this.showComemntBtn) this.showComemntBtn = null;
				else this.showComemntBtn = name
				console.log(name)
			},
			async chooseImage() {
				if (this.images.length >= 6) {
					uni.$u.toast('至多可添加6张图片')
					return;
				}
				try {
					const res = await uni.chooseImage({
						count: 6
					});

					const imageList = res.tempFilePaths;
					this.$refs.upload.open()

					const uploadPromises = imageList.map(async (item) => {
						try {
							const uploadedImage = await this.upload(item);
							this.images.push(uploadedImage);
						} catch (error) {
							this.uploadErr.status = true
							this.uploadErr.msg = error.data.msg
							console.error("Upload failed:", error);
						}
					});

					await Promise.all(uploadPromises);

					this.$refs.upload.close()

				} catch (error) {
					this.$refs.upload.close()
					console.error("Choose image failed:", error);
				}
			},
			async upload(filePath) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath,
						name: 'file'
					}).then(res => {
						if (res.data.code) {
							resolve(res.data.data.url)
						} else {
							reject(res)
						}
					})
				});
			},
			previewImg(urls, index) {
				uni.previewImage({
					urls: urls,
					current: index
				})
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
			insertEmoji(base, name, slug, emoji, format, key) {
				this.editorCtx.insertImage({
					src: base + slug + '_' + emoji + '.' + format,
					alt: name + '_' + key + '_' + 'emoji',
					width: '30px',
					height: '30px',
					data: {
						name: name,
						emoji: emoji,
						format: format
					},
					success: res => {

					}
				})
			},
			preview(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			}
		}
	}
</script>

<style>
	.ql-container ::v-deep .ql-blank::before {
		min-height: 60rpx;
		height: 60rpx;
		font-style: normal;
	}
</style>