<template>
	<view>
		<uv-navbar autoBack placeholder>
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="right">
				<view
					style="display: flex;align-items: center;background: #ff0800; border-radius: 50rpx;padding: 4rpx 16rpx;color: white;font-size: 28rpx;">
					<view hover-class="button_hover" @click="save()">
						<text>发布</text>
					</view>
				</view>
			</view>
		</uv-navbar>
		<view style="margin: 30rpx;" id="input">
			<u-row align="center">
				<u-col :span="7">
					<u-input maxlength="30" :adjustPosition="false" border="bottom" v-model="article.title"
						placeholder="请输入标题(必须)" customStyle="padding: 0;"></u-input>
				</u-col>
				<u-row justify="space-between"
					style="border-radius: 50rpx;background: #f7f7f7;flex-shrink: 0;padding: 10rpx;flex:1;margin-left: 20rpx;"
					@click="showCategory = true">
					<u-row>
						<image :src="article.category.imgurl" mode="aspectFill"
							style="border-radius: 50rpx;width: 50rpx;height: 50rpx;"></image>
						<view style="margin-left: 20rpx">
							<text>{{article.category.name}}</text>
						</view>
					</u-row>
					<i class="ess mgc_right_line"></i>
				</u-row>
			</u-row>
		</view>
		<view style="margin: 30rpx;;background: #f7f7f7;border-radius: 20rpx;padding: 30rpx;">
			<editor id="editor" :adjust-position="false" placeholder="内容写在顶部,其余位置不要写,请上传图片" @ready="onEditorReady"
				:style="`height:${editorHeight -keyboardHeight-toolbarHeight-180}px;`"></editor>
		</view>
		<view id="toolbar" style="margin: 30rpx;">
			<u-row justify="space-between">
				<i class="ess mgc_pic_2_line" style="font-size: 45rpx;" @click="chooseImage()"></i>
				<!-- 标签 -->
				<u-col :span="10">
					<u-row justify="space-between" @click="showTag = true">
						<u-row style="margin-left: 20rpx;">
							<text style="flex-shrink: 0;">标签：</text>
							<scroll-view scroll-y style="height: 100%;">
								<u-row>
									<block v-for="(item,index) in tags" key="index">
										<view
											style="border-radius: 50rpx; padding: 8rpx 14rpx;background: #ff08001e;color: #ff0800;font-size: 26rpx; margin-right: 20rpx;">
											<text>{{item.name}}</text>
										</view>
									</block>
								</u-row>
							</scroll-view>
						</u-row>
						<i class="ess mgc_right_line"></i>
					</u-row>
				</u-col>
			</u-row>
		</view>
		<!-- 组件 -->
		<uv-modal ref="publish" :closeOnClickOverlay="false" :showConfirmButton="false" :show-cancel-button="false"
			width="300rpx">
			<uv-loading-icon text="发布中..." mode="circle" color="#ff0800"></uv-loading-icon>
			<view slot="confirmButton"></view>
		</uv-modal>
		<u-popup customStyle="border-radius:40rpx 40rpx 0 0;" :show="showCategory" @close="showCategory = false"
			:closeable="true">
			<view style="height: 70vh;padding:30rpx;background:#fff;border-radius:40rpx 40rpx 0 0;">
				<view style="text-align: center;">选择板块</view>
				<view style="margin-top: 30rpx;">
					<scroll-view scroll-y style="height: 65vh;">
						<u-row justify="space-between" style="flex-wrap: wrap;">
							<block v-for="(item,index) in category" :key="index">
								<u-col :span="5.8">
									<u-row style="padding: 20rpx;" align="top"
										@click="article.category = item;showCategory = false">
										<image :src="item.imgurl" mode="aspectFill"
 											style="width: 100rpx;height: 100rpx;border-radius: 20rpx;background: #f7f7f7;flex-shrink: 0;">
										</image>
										<view style="margin-left: 20rpx;display: flex;flex-direction: column;">
											<text style="font-weight: 600;" class="u-line-1">{{item.name}}</text>
											<text style="font-size: 30rpx;color: #999;"
												class="u-line-1">{{item.description}}</text>
										</view>
									</u-row>
								</u-col>
							</block>
						</u-row>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<!-- 标签&&话题 -->
		<u-popup customStyle="border-radius:40rpx 40rpx 0 0" :show="showTag" @close="showTag = false">
			<view style="height: 70vh;padding:30rpx">
				<view style="margin-top: 30rpx;">
					<u-row customStyle="flex-wrap:nowrap;font-size:30rpx">
						<text style="font-weight: bold;">标签&话题：</text>
						<text style="color: #999;">选择相关内容、分类，获得更多浏览</text>
					</u-row>
					<view style="margin-top: 20rpx;">
						<u-input prefix-icon="search" placeholder="搜索标签&话题"
							customStyle="padding:10rpx 6rpx;background:#f7f7f7" border="none"></u-input>
					</view>
				</view>
				<view style="margin-top: 40rpx;">
					<text style="font-weight: bold;">推荐话题</text>
					<scroll-view scroll-y style="flex:1;height: 55vh;;overflow-y: scroll;">
						<block v-for="(item,index) in tags" :key="index">
							<view @click="tagTap(item)" style="padding: 10rpx 0;">
								<text
									:style="{color:article.tags.some(tag=>tag.mid == item.mid)?'#ff0800':''}">{{item.name}}</text>
							</view>
						</block>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<u-modal :show="showLoading" @close="showLoading=false;uploadErr.status = false;uploadErr.msg=null;"
			:closeOnClickOverlay="uploadErr.status" :showConfirmButton="false"
			:title="uploadErr.status?'上传错误':'上传中...'">
			<u-line-progress :percentage="percentage" activeColor="#ff0800" :showText="false"
				v-if="!uploadErr.status"></u-line-progress>
			<text v-if="uploadErr.status">错误信息：{{uploadErr.msg}}</text>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				images: [],
				percentage: 0,
				uploadErr: {
					status: false,
					msg: null,
				},
				showTag: false,
				showLoading: false,
				showCategory: false,
				category: [],
				tags: [],
				keyboardHeight: 0,
				toolbarHeight: 0,
				editorHeight: 0,
				article: {
					title: '',
					text: '',
					category: {},
					tags: [],
					opt: {
						create: false,
						files: [{}],
						// files:
						// name: null,  //名称
						// link: null,  //连接
						// password: null, //提取密码
						// unzipPass: null, //解压密码
						// downloadType: null, // 网盘地址 或者直链
						permission: [],
						gift: [],
						// Gift type 可选 item 可选
					}
				},
				editorCtx: null,
				windowHeight: 0,
				isSave: false,

			}
		},
		created() {
			this.initData()
		},
		onReady() {
			let inputHeight = 0;
			uni.createSelectorQuery().in(this).select("#input").boundingClientRect(data => {
				inputHeight = data.height
			}).exec()
			uni.createSelectorQuery().in(this).select("#toolbar").boundingClientRect(data => {
				this.toolbarHeight = data.height
			}).exec()
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
			let systemInfo = uni.getSystemInfoSync()
			this.editorHeight = systemInfo.screenHeight - systemInfo.statusBarHeight - inputHeight
		},
		methods: {
			initData() {
				this.getCategory()
				this.getTags()
			},

			getCategory() {
				this.$http.get('/category/list', {
					params: {
						limit: 100,
						params: JSON.stringify({
							type: 'category',
						}),
					}
				}).then(res => {

					if (res.data.code == 200) {
						let data = res.data.data.data;
						for (let i in data) {
							if (data[i].mid == 1) this.article.category = data[i];
						}
						this.category = data
					}
				})
			},
			getTags() {
				this.$http.get('/category/list', {
					params: {
						params: JSON.stringify({
							type: 'tag',
						}),
						order: 'count desc'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.tags = res.data.data.data

					}
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
			save() {
				if (this.isSave) return;
				if (this.article.title < 4) {
					uni.$u.toast('标题太短')
					this.isSave = false;
					return
				}
				this.isSave = true;
				this.editorCtx.getContents({
					success: res => {
						this.article.text = res.html
						if (res.html.length < 15) {
							uni.$u.toast('你还没上传图片呢')
							this.isSave = false;
							return
						}
						this.$refs.publish.open()
						let tags = this.article.tags.map(tag => tag.mid).join(',')
						this.$http.post('/article/articleAdd', {
							title: this.article.title,
							text: this.article.text,
							category: this.article.category.mid,
							tag: tags,
							type: 'photo',
							opt: JSON.stringify(this.article.opt),
							images: this.images
						}).then(res => {
							if (res.data.code == 200) {
								setTimeout(() => {
									this.$Router.back(1)
								}, 1500)
							}
							setTimeout(() => {
								this.$refs.publish.close()
							}, 1000)
							uni.$u.toast(res.data.msg)
							this.isSave = false;
						}).catch(err => {
							this.isSave = false;
						})
					}
				})

			},
			async chooseImage() {
				this.percentage = 0; // 重置进度条
				try {
					const res = await uni.chooseImage({
						count: 100
					});
					let increment = 100 / res.tempFilePaths.length; // 计算每张图片的上传进度增量
					let count = res.tempFilePaths.length;

					this.showLoading = true;

					for (let i in res.tempFilePaths) {
						let image = await this.upload(res.tempFilePaths[i]);
						count--;
						this.percentage += increment; // 增加上传进度
						this.editorCtx.insertImage({
							src: image,
							alt: this.article.title ? this.article.title : 'IMAGE'
						});
					}

					if (count === 0) {
						setTimeout(() => {
							this.showLoading = false;
						}, 200);
					}

					this.editorCtx.insertText({
						text: '\n'
					});
				} catch (err) {
					console.error(err); // 打印错误信息到控制台
				}
			},
			tagTap(item) {
				// 检查标签是否已存在于数组中
				const index = this.article.tags.findIndex(tag => tag.mid === item.mid);

				if (index !== -1) {
					// 如果存在，从数组中删除
					this.article.tags.splice(index, 1);
				} else {
					// 如果不存在，加入数组
					this.article.tags.push(item);
				}
			},
			upload(image) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath: image,
						name: 'file',
					}).then(res => {

						if (res.data.code == 200) {
							this.images.push(res.data.data.url)
							resolve(res.data.data.url)
						} else {
							this.uploadErr.status = true
							this.uploadErr.msg = res.data.msg
						}
					}).catch(err => {
						this.uploadErr.status = true
						this.uploadErr.msg = '网络错误'
					})
				})
			},
		}
	}
</script>

<style lang="scss">
	.ql-container ::v-deep .ql-blank::before {
		font-style: normal;
		color: #999;
		min-height: 0rpx;
	}

	.ql-container ::v-deep img {
		margin: 20rpx auto;
		border-radius: 20rpx;
		max-width: 80%;
		display: block;
	}

	.button_hover {
		opacity: 0.5;
	}

	.imageCover {
		position: relative;
		object-fit: cover;
		width: 100%;
		height: 200px;
	}
</style>