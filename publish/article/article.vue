<template>
	<view>
		<u-navbar placeholder autoBack id="navbar">
			<view slot="left">
				<i class="ess icon-left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="center">
				<text>{{update?'更新帖子':'发布帖子'}}</text>
			</view>
			<view slot="right">
				<view
					style="display: flex;align-items: center;background: #85a3ff; border-radius: 50rpx;padding: 4rpx 16rpx;color: white;font-size: 28rpx;">
					<view style="border-radius: 50rpx 0 0 50rpx;margin-right: 10rpx;" hover-class="button_hover"
						@click="showDraft = true">
						<text>草稿箱</text>
					</view>
					<view style="border-radius: 50rpx 0 0 50rpx;margin-left: 10rpx;" hover-class="button_hover"
						@click="update?updateArticle(): save()">
						<text>{{update?'更新':'发布'}}</text>
					</view>
				</view>
			</view>
		</u-navbar>
		<view style="padding:20rpx 30rpx 0rpx 30rpx;" id="inputTitle">
			<u-input v-model="article.title" placeholder="标题 (必填)" border="none"
				customStyle="padding-bottom:10rpx;border-bottom:2rpx solid #f1f1f1"></u-input>
		</view>
		<editor :adjust-position="false" placeholder="灵感迸发" id="editor" @ready="onEditorReady"
			style="width: 100%;padding:10rpx 30rpx 0rpx 30rpx;"
			:style="{height:editorHeight - keyboardHeight - toolbarHeight - 4 -(showPanel?panelHeight:0) +'px'}"
			@statuschange="statuschange">
		</editor>
		<view id="toolbar" style="background: #fff;padding: 10rpx 30rpx; 0rpx 30rpx">
			<u-row justify="space-between" @click="showCategory = true">
				<text>选择发布位置</text>
				<u-row>
					<text>{{ article && article.category && article.category.name}}</text>
					<u-icon name="arrow-right" color="#999"></u-icon>
				</u-row>
			</u-row>
			<view style="padding-top: 30rpx;padding-bottom: 30rpx;">
				<u-row @click="showTag = true">
					<u-row>
						<text>参与话题</text>
						<u-icon name="play-right-fill" size="14" color="#999"></u-icon>
					</u-row>
					<scroll-view scroll-x
						style="overflow: hidden;overflow-x: scroll;white-space: nowrap;margin-left: 20rpx;">
						<u-row>
							<block v-for="(item,index) in tags" :key="index">
								<view
									style="margin-right: 20rpx;background: #f7f7f7;padding:4rpx 20rpx;border-radius: 10rpx;">
									{{item.name}}
								</view>
							</block>
						</u-row>
					</scroll-view>
				</u-row>
			</view>

			<view style="padding-bottom: 20rpx;">
				<u-row justify="space-between">
					<u-row justify="space-between" customStyle="flex:1">
						<i class="ess icon-pic_line" style="font-size: 40rpx;" @click="chooseImage()"></i>
						<i class="ess icon-emoji_line" style="font-size: 40rpx;" @click="showItem('emoji')"></i>
						<i class="ess icon-font_line" style="font-size: 40rpx;" @click="showItem('format')"></i>
						<i class="ess icon-play_circle_line" style="font-size: 40rpx;" @click="chooseVideo()"></i>
						<i class="ess icon-add_line" style="font-size: 40rpx;" @click="showItem('more')"></i>
					</u-row>
					<view style="margin-left: 140rpx;">
						<i class="ess icon-settings_1_line" style="font-size: 40rpx;" @click="showItem('setting')"></i>
					</view>
				</u-row>
			</view>
			<!-- 视频处理 -->
			<view style="display: none;" :prop="videoPath" :change:prop="capture.captures"></view>
			<view v-if="showPanel" :style="{height:panelHeight+'px'}">
				<!-- 表情 -->
				<view v-show="itemName =='emoji'" style="height: 100%;">
					<block v-for="(one,oneIndex) in emojiData" :key="oneIndex">
						<swiper :style="{height:panelHeight-30+'px'}" v-show="emojiIndex == oneIndex">
							<swiper-item v-for="(two,twoIndex) in one.list" :key="twoIndex">
								<u-row justify="space-between" customStyle="flex-wrap:wrap">
									<image :src="one.base+one.slug+'_'+three+'.'+one.format" v-for="(three,key) in two"
										:key="key" mode="aspectFill" style="width: 100rpx;height: 100rpx;margin: 10rpx;"
										@click="insertEmoji(one.base,one.name,one.slug,three,one.format,key)"></image>
								</u-row>
							</swiper-item>
						</swiper>
					</block>
					<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#85a3ff"
						itemStyle="height: 24px;"
						:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
						:inactiveStyle="{color: '#606266',transform: 'scale(1)'}" @change="emojiIndex = $event.index"
						style="position: static;"></u-tabs>
				</view>
				<!-- 颜色 -->
				<view v-show="itemName=='format'" style="height: 100%;">
					<u-row justify="space-between">
						<u-row justify="start" v-for="(color,index) in format.color" :key="index"
							customStyle="flex-direction:column">
							<text :style="{background:color,padding:25+'rpx',borderRadius:50+'rpx'}"
								@click="formatTool('color',color)"></text>
							<u-icon name="arrow-up-fill" color="#999"
								v-if="formatStatus && formatStatus.color&&formatStatus.color.toLowerCase() == color"></u-icon>
						</u-row>
					</u-row>
					<u-row customStyle="padding-top:40rpx" justify="space-between">
						<text v-for="(method,index) in format.method" :key="index"
							@click="formatTool(method.tool)">{{method.name}}</text>
						<text @click="editorCtx.removeFormat()">清除选区</text>
						<text @click="editorCtx.undo()">撤销</text>
					</u-row>
				</view>

				<!-- 更多 -->
				<view v-show="itemName=='more'">
					<u-row justify="space-between" style="padding-bottom: 10rpx;">
						<text style="font-weight: bold;">添加文件</text>
						<u-row>
							<i class="ess icon-pic_line" style="font-size: 40rpx;"
								@click="$refs.insertImage.open();showInsertImage = true"></i>
							<i class="ess icon-play_circle_line" style="font-size: 40rpx;margin-left: 30rpx;"></i>
						</u-row>
					</u-row>
					<block v-for="(item,index) in article.opt.files" :key="index">
						<u-row customStyle="margin-bottom:10rpx">
							<u-col span="2" customStyle="margin-left:10rpx">
								<u-input placeholder="名称" :adjustPosition="false" border="none" font-size="12"
									customStyle="padding: 8rpx;background:#f7f7f7;border-radius:10rpx"
									v-model="article.opt.files[index].name"></u-input>
							</u-col>
							<u-col span="5" customStyle="margin-left:10rpx">
								<u-input placeholder="资源链接" :adjustPosition="false" border="none" font-size="12"
									customStyle="padding: 8rpx;background:#f7f7f7;border-radius:10rpx"
									v-model="article.opt.files[index].link"></u-input>
							</u-col>
							<u-col span="2" customStyle="margin-left:10rpx">
								<u-input placeholder="提取码" :adjustPosition="false" border="none" font-size="12"
									customStyle="padding: 8rpx;background:#f7f7f7;border-radius:10rpx"
									v-model="article.opt.files[index].password"></u-input>
							</u-col>
							<u-col span="2" customStyle="margin-left:5rpx">
								<u-input placeholder="解压密码" :adjustPosition="false" border="none" font-size="12"
									customStyle="padding: 8rpx;background:#f7f7f7;border-radius:10rpx"
									v-model="article.opt.files[index].unzipPass"></u-input>
							</u-col>
							<u-col span="1" customStyle="margin-left:10rpx">
								<u-icon :name="article.opt.files.length>=2?'minus-circle':'plus-circle'" size="20"
									color="#85a3ff" @click="addFile(index)"></u-icon>
							</u-col>
						</u-row>
					</block>
				</view>

				<!-- 设置 -->
				<view v-show="itemName=='opt'">
					<u-row justify="space-between">
						<u-row customStyle="flex-direction:column" justify="start" align="top">
							<text style="font-size: 32rpx;font-weight: bold;">创作声明</text>
							<text style="font-size: 26rpx;color: #999;">开启之后文章显示创作声明</text>
						</u-row>
						<u-switch size="20" v-model="article.opt.create" activeColor="#85a3ff"></u-switch>
					</u-row>
					<u-gap height="6"></u-gap>
					<u-row justify="space-between">
						<text style="font-size: 32rpx;font-weight: bold;">允许评论</text>
						<u-switch size="20" v-model="article.allowComment" activeColor="#85a3ff"></u-switch>
					</u-row>
					<u-gap height="6"></u-gap>
					<u-row justify="space-between">
						<text style="font-size: 32rpx;font-weight: bold;">付费可见价格</text>
						<u-number-box v-model="article.price" integer :min="0" :max="100"></u-number-box>
					</u-row>
				</view>
			</view>
		</view>
		<!-- 组件 -->
		<!-- 分类 -->
		<u-popup mode="right" :show="showCategory" @close="showCategory = false">
			<view style="width: 70vw;">
				<u-gap height="60"></u-gap>
				<view style="padding:30rpx">
					<text style="font-weight: bold;font-size: 34rpx;">选择分类</text>
					<view style="padding-top: 20rpx;">
						<block v-for="(item,index) in category" :key="index">
							<u-row @click="article.category = item;showCategory = false" style="margin-bottom: 20rpx;">
								<text v-if="item.isrecommend" style="
									font-size: 26rpx;
									color:#85a3ff;
									background: #85a3ff3c;
									padding:4rpx 14rpx;
									border-radius: 10rpx;">推荐</text>
								<u-row>
									<u-avatar :src="item.imgurl" size="30" shape="square" v-if="item.imgurl"
										mode="aspectFill"></u-avatar>
									<text style="margin-left: 20rpx;"
										:style="{color:article.category && article.category.mid == item.mid?'#85a3ff':''}">{{item.name}}</text>
								</u-row>
							</u-row>
						</block>
					</view>
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
							<view @click="tagTap(item)">
								<text
									:style="{color:article.tags.some(tag=>tag.mid == item.mid)?'#85a3ff':''}">{{item.name}}</text>
							</view>
						</block>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<u-modal :show="showLoading" ref="uModal"
			@close="showLoading=false;uploadErr.status = false;uploadErr.msg=null;"
			:closeOnClickOverlay="uploadErr.status" :showConfirmButton="false"
			:title="uploadErr.status?'上传错误':'上传中...'">
			<u-line-progress :percentage="percentage" activeColor="#85a3ff" :showText="false"
				v-if="!uploadErr.status"></u-line-progress>
			<text v-if="uploadErr.status">错误信息：{{uploadErr.msg}}</text>
		</u-modal>
		<uv-modal ref="chooseFrame" :showConfirmButton="false" :showCancelButton="false"
			@close="videoInfo.poster?'':videoInfo.poster = videoInfo.frame[0].url" title="选择视频封面"
			:closeOnClickOverlay="true" :zIndex="50">
			<view style="display: flex;flex-wrap: wrap;justify-content: center;flex: 1;">
				<block v-for="(item,index) in videoInfo.frame" :key="index">
					<view style="position: relative;top: 0;">
						<image :src="item.url" mode="aspectFill" @click="preview(videoInfo.frame,index)"
							style="width: 140rpx;height: 140rpx;margin: 10rpx;border-radius: 10rpx;"></image>
						<view
							style="position: absolute;bottom:22rpx;right:8rpx;background-color: #fff;height:40rpx;width: 40rpx;text-align: center;border-radius: 10rpx 0 10rpx 0;box-shadow: -2px -2px 2px #0000001e;"
							@click="videoInfo.poster = item">
							<u-icon name="checkmark" color="#85a3ff" size="18"
								v-show="videoInfo.poster&&videoInfo.poster.url == item.url"></u-icon>
						</view>
					</view>
				</block>
				<u-button text="添加视频" color="#85a3ff" shape="circle" @click="insertVideo()"></u-button>
			</view>

			<view slot="confirmButton"></view>
		</uv-modal>
		<uv-modal ref="publish" :closeOnClickOverlay="false" :showConfirmButton="false" :show-cancel-button="false"
			width="300rpx">
			<uv-loading-icon text="发布中..." mode="circle" color="#85a3ff"></uv-loading-icon>
			<view slot="confirmButton"></view>
		</uv-modal>
		<uv-modal ref="insertImage" :showConfirmButton="false" title="插入图片" :zIndex="100"
			@close="showInsertImage = false">
			<view style="display: flex;flex-direction: column;width: 100%;">
				<view>
					<u-input v-model="images" border="bottom" customStyle="padding:10rpx 0rpx"
						placeholder="https://"></u-input>
				</view>
				<view style="margin-top: 30rpx;">
					<u-button shape="circle" color="#85a3ff" @click="insertImages()">插入</u-button>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</uv-modal>
		<!-- 草稿箱 -->
		<u-popup :show="showDraft" mode="bottom" round="20" @close="showDraft = false" :closeable="true">
			<u-gap height="30"></u-gap>
			<view style="margin: 30rpx;height: 60vh;">
				<text style="font-size: 34rpx;font-weight: 600;">草稿箱</text>
				<scroll-view style="overflow: scroll;height: 55vh;" scroll-y>
					<view v-if="draftList">
						<block v-for="(item,index) in draftList" v-if="item.draftId !=draftId">
							<view style="padding:30rpx;background:#85a3ff0a;border-radius: 20rpx;margin-bottom: 20rpx;"
								@click="insertDraft(item)">
								<text v-if="item.title">{{item.title}}</text>
								<u-parse style="overflow: hidden;" :content="item.text" v-if="item.text"
									class="u-line-2"></u-parse>
							</view>
						</block>
					</view>
				</scroll-view>

			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		base64ToPath
	} from 'image-tools'
	import upload from '../../uni_modules/uview-ui/libs/config/props/upload'
	export default {
		data() {
			return {
				showDraft: false,
				draftList: [],
				draftId: 0,
				showInsertImage: false,
				videoPath: null,
				VideoFrame: [],
				videoInfo: {
					frame: [],
					width: 0,
					height: 0,
					url: null,
					poster: null,
				},
				chooseFrame: false,
				images: '',
				emojiData: [],
				percentage: 30,
				showLoading: false,
				showPanel: false,
				format: {
					color: ['#85a3ff', '#5bd784', '#ffa600', '#0dd0f2', '#fb4f14', '#000000'],
					method: [{
						name: '粗体',
						tool: 'bold'
					}, {
						name: '斜体',
						tool: 'italic'
					}, {
						name: '下划线',
						tool: 'underline'
					}],
					header: ['H3', 'H4']
				},
				formatStatus: null,
				panelHeight: 150,
				emojiIndex: 0,
				itemName: null,
				uploadErr: {
					status: false,
					msg: null,
				},
				editorCtx: null,
				keyboardHeight: 0,
				editorHeight: 0,
				toolbarHeight: 0,
				showCategory: false,
				showTag: false,
				category: [],
				tags: [],
				article: {
					title: null,
					price: 0,
					discount: 1,
					text: null,
					type: 'post',
					category: {
						mid: 1
					},
					tags: [],
					allowComment: true,
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
				update: 0,
				timer: null,
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
		onLoad(params) {
			console.log(params)
			this.update = params.update
			if (params.update) {
				this.getContentInfo(params.id)
			}

			if (!params.update) {
				this.timer = setInterval(() => {
					this.editorCtx.getContents({
						success: (res) => {
							if (res.text.length > 2) {
								const index = this.draftList.findIndex(draft => draft.draftId === this
									.draftId);
								if (index !== -1) {
									// Update existing draft
									this.$set(this.draftList, index, {
										draftId: this.draftId,
										...this.article,
										text: res.html,
									});
									uni.setStorageSync('draftList', this.draftList);
								} else {
									// Add new draft
									this.draftList.push({
										draftId: this.draftId,
										...this.article,
										text: res.html
									});
								}
							}
						}
					});
				}, 5000);
			}

		},
		created() {
			this.formatEmoji()
			this.initData()
			this.draftList = uni.getStorageSync('draftList')
			if (!this.draftList.length) this.draftList = [];
			this.draftId = this.draftList.length + 1
		},
		beforeDestroy() {
			clearInterval(this.timer);
		},
		beforeRouteLeave(to, from, next) {
			if (this.showInsertImage || this.showCategory || this.showDraft) {
				this.showInsertImage = false;
				this.showCategory = false;
				this.showDraft = false;
				this.$refs.insertImage.close()
				return
			}
			next()
		},
		methods: {
			initData() {
				this.getCategory()
				this.getTags()
			},

			getCategory() {
				this.$http.get('/category/list', {
					params: {
						searchParams: JSON.stringify({
							type: 'category',

						}),
					}
				}).then(res => {
					if (res.data.code) {

						for (let i in res.data.data) {
							if (res.data.data[i].mid == 1) this.article.category = res.data.data[i];
						}
						this.category = res.data.data
					}
				})
			},
			getTags() {
				this.$http.get('/category/list', {
					params: {
						searchParams: JSON.stringify({
							type: 'tag',
						}),
						order: 'count'
					}
				}).then(res => {

					if (res.data.code) {
						this.tags = res.data.data

					}
				})
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

			async chooseImage() {
				this.percentage = 0; // 重置进度条
				try {
					const res = await uni.chooseImage({
						count: 20
					});
					let increment = 70 / res.tempFilePaths.length; // 计算每张图片的上传进度增量
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
				} catch (error) {
					console.error(error); // 打印错误信息到控制台
				}
			},
			// 选择视频
			chooseVideo() {
				// 重置进度条
				this.percentage = 30;
				uni.chooseVideo({
					extension: ['mp4', 'avi', 'webm'],
					compressed: true,
					success: (res) => {
						this.videoPath = res.tempFilePath
						this.videoInfo.width = res.width
						this.videoInfo.height = res.width
					}
				})
			},
			async captureList({
				list,
				duration
			}) {
				this.videoInfo.frame = list
				console.log(list)

				//开始上传
				this.showLoading = true
				let video = await this.uploadFile(this.videoPath, 'video')
				if (video) {
					this.videoInfo.url = video
					setTimeout(() => {
						this.showLoading = false
						this.$refs.chooseFrame.open()
					}, 200)
				}
			},
			preview(url, index) {
				uni.previewImage({
					urls: url[index].base64
				})
			},
			uploadFile(url, type) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						fileType: type, // 仅允许video/image/audio
						filePath: url, //不支持多文件上传使用filePath
						name: 'file',
					}).then(res => {
						console.log(res)
						if (res.data.code) {
							resolve(res.data.data.url)
						} else {
							this.uploadErr.status = true
							this.uploadErr.msg = res.data.msg
							uni.hideLoading()
						}
					}).catch(err => {
						console.log(err)
						this.uploadErr.status = true
						this.uploadErr.msg = err.data.msg
					})
				})

			},
			upload(image) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath: image,
						name: 'file',
					}).then(res => {
						console.log(res)
						if (res.data.code) {
							resolve(res.data.data.url)
						} else {
							this.uploadErr.status = true
							this.uploadErr.msg = res.data.msg
						}
					}).catch(err => {
						console.log(err)
						this.uploadErr.status = true
						this.uploadErr.msg = '网络错误'
					})
				})
			},
			save() {
				if (this.article.title < 4) {
					uni.$u.toast('标题太短')
					return
				}

				this.editorCtx.getContents({
					success: res => {
						this.article.text = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `_|#${alt}|`;
							});

						if (this.article.text.length < 20) {
							uni.$u.toast('再多写点吧~');
							return;
						}

						this.$refs.publish.open();
						let tags = this.article.tags.map(tag => tag.mid).join(',');
						this.$http.post('/article/articleAdd', {
							params: JSON.stringify({
								title: this.article.title,
								text: this.article.text,
								category: this.article.category.mid,
								mid: this.article.category.mid,
								tag: tags,
								opt: JSON.stringify(this.article.opt),
								price: this.article.price,
								discount: this.article.discount
							}),
							text: this.article.text,
						}).then(res => {
							if (res.data.code) {
								setTimeout(() => {
									this.$refs.publish.close();
									uni.$u.toast(res.data.msg);
									setTimeout(() => {
										this.$Router.back(1);
									}, 800);
								}, 1500);
							} else {
								uni.$u.toast(res.data.msg);
								this.$refs.publish.close();
							}
						});
					}
				});
			},


			showItem(item) {
				if (this.itemName != item) {
					this.itemName = item
					this.showPanel = true
				} else {
					this.itemName = null
					this.showPanel = false
				}
			},
			formatEmoji() {
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
					success: res => {
						this.editorCtx.insertText({
							text: '  '
						})
					}
				})
			},
			formatImage(base64) {
				return new Promise((resolve, reject) => {
					base64ToPath(base64).then(res => {
						resolve(res)
					})
				})
			},
			async insertVideo() {
				uni.showLoading({
					title: '插入中...',
					mask: true
				})
				let file = await this.formatImage(this.videoInfo.poster.base64);
				let poster = await this.uploadFile(file, 'image');
				console.log(poster)
				if (poster) {
					this.editorCtx.insertImage({
						src: poster,
						alt: `src=${this.videoInfo.url}|poster=${poster}|type=video`,
						width: '100%',
						height: '200px',
						data: {
							type: 'video',
							poster: poster,
							src: this.videoInfo.url,
						},
						success: (res) => {
							this.editorCtx.insertText({
								text: '\n\n'
							})
							uni.hideLoading()
							this.$refs.chooseFrame.close()
						}
					})
				}
			},

			formatTool(type, value) {
				this.editorCtx.format(type, value)
			},
			con() {
				this.editorCtx.getContents({
					success: res => {

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

				setTimeout(() => {
					this.setContents()
				}, 500)
			},
			statuschange(event) {
				this.formatStatus = event.detail
			},
			addFile(index) {
				if (this.article.opt.files.length < 2) {
					// 如果数组长度小于2，执行添加操作
					this.article.opt.files.push({});
				} else {
					// 否则，执行删除操作
					this.article.opt.files.splice(index, 1);
				}
			},
			getContentInfo(id) {
				this.$http.get('/article/info', {
					params: {
						key: id,
						isMd: 1,
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}
				}).then(res => {
					if (res.data) {
						this.article.cid = res.data.cid
						this.article.title = res.data.title
						this.article.text = res.data.text
						this.article.category = res.data.category[0] ? res.data.category[0] : this.category[0]
						this.article.tags = res.data.tag
						this.article.mid = res.data.mid
						this.article.opt = res.data.opt
						this.article.price = res.data.price
						this.article.discount = res.data.discount

						this.editorCtx.getContents({
							success: (res) => {
								if (res.text.length < 2) {
									this.setContents()
								}
							}
						})
					}

				})
			},
			setContents() {
				this.editorCtx.setContents({
					html: this.article.text,

				})
			},
			updateArticle() {
				this.editorCtx.getContents({
					success: (res) => {
						this.article.text = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `_|#${alt}|`;
							});

						if (res.text.length < 3) {
							uni.$u.toast('再多写点吧~')
							return;
						}
						if (this.article.title.length < 3) {
							uni.$u.toast('标题太短')
							return;
						}
						console.log(this.article)
						let tags = this.article.tags.map(tag => tag.mid).join(',');
						this.$http.post('/article/articleUpdate', {
							params: JSON.stringify({
								cid: this.article.cid,
								title: this.article.title,
								text: this.article.text,
								category: this.article.category.mid ? this.article.category
									.mid : this.article.mid,
								mid: this.article.category.mid ? this.article.category.mid :
									this.article.mid,
								tag: tags,
								price: this.article.price,
								discount: this.article.discount,
								opt: JSON.stringify(this.article.opt)
							}),
							isMd: 0,
						}).then(res => {
							if (res.data.code) {
								uni.$u.toast(res.data.msg)
								setTimeout(() => {
									this.$Router.back(1)
								}, 500)
							}
						})
					}
				})
			},
			insertImages() {
				if (!this.images) {
					uni.$u.toast('链接不可为空')
					return;
				}
				this.editorCtx.insertImage({
					src: this.images,
					alt: 'IMAGE',
					success: (res) => {
						this.images = ''
						this.editorCtx.insertText({
							text: '\n'
						})
						this.$refs.insertImage.close()
					}
				});
			},
			insertDraft(data) {
				console.log(data)
				this.article = data
				this.draftId = data.draftId
				this.editorCtx.setContents({
					html: this.article.text,

					success: (res) => {
						this.showDraft = false

					}
				})
			}
		}
	}
</script>
<script module="capture" lang="renderjs">
	export default {
		methods: {
			async captures(videoPath) {
				let duration = await this.getDuration(videoPath)
				let list = []
				for (let i = 0; i < 12; i++) {
					const frame = await this.captureFrame(videoPath, duration / 1000 * i)
					list.push(frame)
				}
				this.$ownerInstance.callMethod('captureList', {
					list,
					duration
				})
			},
			getDuration(videoPath) {
				return new Promise(resolve => {
					const vdo = document.createElement('video')
					vdo.src = videoPath
					vdo.addEventListener('loadedmetadata', () => {
						const duration = Math.floor(vdo.duration);
						vdo.remove();
						resolve(duration)
					});
				})
			},
			captureFrame(videoPath, time = 0) {
				return new Promise((resolve) => {
					const vdo = document.createElement('video')
					// video元素没有加到dom上，video播放到currentTime（当前帧）结束
					// 定格时间，截取帧
					vdo.currentTime = time
					// 设置自动播放，不播放是黑屏状态，截取不到帧画面
					// 静音状态下允许自动播放
					vdo.muted = true
					vdo.autoplay = true
					vdo.crossOrigin = 'anonymous'
					vdo.src = videoPath
					vdo.oncanplay = async () => {
						const frame = await this.drawVideo(vdo)
						resolve(frame)
					}
				})
			},
			drawVideo(vdo) {
				return new Promise((resolve) => {
					const cvs = document.createElement('canvas')
					const ctx = cvs.getContext('2d')
					cvs.width = vdo.videoWidth
					cvs.height = vdo.videoHeight
					ctx.drawImage(vdo, 0, 0, cvs.width, cvs.height)

					// 创建blob对象
					cvs.toBlob((blob) => {
						var reader = new FileReader();
						reader.readAsDataURL(blob);
						reader.onload = function(e) {
							resolve({
								blob,
								base64: e.target.result,
								url: URL.createObjectURL(blob),
							})
						}

					})
				})
			},
		}
	}
</script>


<style lang="scss">
	.panel {
		transform: translateY(10vh);
		transition: transform 0.3s ease;
		background: #fff;

	}

	.ql-container ::v-deep .ql-blank::before {
		font-style: normal;
		color: #999;
	}

	.ql-container ::v-deep img {
		margin: 20rpx auto;
		border-radius: 20rpx;
		max-width: 80%;
	}

	.button_hover {
		opacity: 0.5;
	}
</style>