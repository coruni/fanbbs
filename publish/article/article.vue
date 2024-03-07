<template>
	<view>
		<u-navbar placeholder autoBack id="navbar">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="center">
				<text>{{update?'更新帖子':'发布帖子'}}</text>
			</view>
			<view slot="right">
				<view
					style="display: flex;align-items: center;background: #ff0800; border-radius: 50rpx;padding: 4rpx 16rpx;color: white;font-size: 28rpx;">
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
		<!--  -->
		<editor :adjust-position="false" placeholder="灵感迸发" id="editor" @ready="onEditorReady"
			style="width: 100%;padding:10rpx 30rpx 10rpx 30rpx;"
			:style="{height:editorHeight - keyboardHeight - toolbarHeight - 4 -(showPanel?panelHeight:0) +'px',minHeight:0+'px'}"
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
						<i class="ess mgc_pic_line" style="font-size: 48rpx;" @click="chooseImage()"></i>
						<i class="ess mgc_emoji_line" style="font-size: 48rpx;"
							:class="{'button-color':itemName=='emoji'}" @click="showItem('emoji')"></i>
						<i class="ess mgc_font_line" :class="{'button-color':itemName=='format'}"
							style="font-size: 48rpx;" @click="showItem('format')"></i>
						<i class="ess mgc_play_circle_line" style="font-size: 48rpx;" @click="chooseVideo()"></i>
						<i class="ess mgc_folder_3_line" :class="{'button-color':itemName=='more'}"
							style="font-size: 48rpx;" @click="showItem('more')"></i>
						<i class="ess mgc_add_line" style="font-size: 48rpx;" @click="showAddMore= true"></i>
					</u-row>
					<view style="margin-left: 120rpx;">
						<i class="ess mgc_settings_1_line" style="font-size: 48rpx;" @click="showItem('setting')"></i>
					</view>
				</u-row>
			</view>
			<view v-if="showPanel" :style="{height:panelHeight+'px'}" :class="{'showPanel':showPanel}">
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
					<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#ff0800"
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
							<i class="ess mgc_pic_line" style="font-size: 40rpx;"
								@click="$refs.insertImage.open();showInsertImage = true"></i>
							<i class="ess mgc_play_circle_line" style="font-size: 40rpx;margin-left: 30rpx;"></i>
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
									color="#ff0800" @click="addFile(index)"></u-icon>
							</u-col>
						</u-row>
					</block>
				</view>

				<!-- 设置 -->
				<view v-show="itemName=='setting'">
					<u-row justify="space-between">
						<u-row customStyle="flex-direction:column" justify="start" align="top">
							<text style="font-size: 32rpx;font-weight: bold;">创作声明</text>
							<text style="font-size: 26rpx;color: #999;">开启之后文章显示创作声明</text>
						</u-row>
						<u-switch size="20" v-model="article.opt.create" activeColor="#ff0800"></u-switch>
					</u-row>
					<u-gap height="6"></u-gap>
					<u-row justify="space-between">
						<text style="font-size: 32rpx;font-weight: bold;">允许评论</text>
						<u-switch size="20" v-model="article.allowComment" activeColor="#ff0800"></u-switch>
					</u-row>
					<u-gap height="6"></u-gap>
					<u-row justify="space-between">
						<text style="font-size: 32rpx;font-weight: bold;">付费可见价格</text>
						<u-number-box v-model="article.price" integer :min="0" :max="100"></u-number-box>
					</u-row>
				</view>
			</view>
			<!-- 视频处理 -->
			<view style="display: none;" :prop="videoPath" :change:prop="capture.captures"></view>
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
									color:#ff0800;
									background: #ff08003c;
									padding:4rpx 14rpx;
									border-radius: 10rpx;
									margin-right: 20rpx;">推荐</text>
								<u-row>
									<u-avatar :src="item.imgurl" size="30" shape="square" v-if="item.imgurl"
										mode="aspectFill"></u-avatar>
									<text style="margin-left: 20rpx;"
										:style="{color:article.category && article.category.mid == item.mid?'#ff0800':''}">{{item.name}}</text>
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
							<u-row @click="tagTap(item)" style="margin-bottom: 20rpx;">
								<image v-if="item.imgurl" :src="item.imgurl" mode="aspectFill"
									style="width: 60rpx;height: 60rpx;background: #f7f7f7;margin-right: 20rpx;border-radius: 20rpx;">
								</image>
								<text
									:style="{color:article.tags.some(tag=>tag.mid == item.mid)?'#ff0800':''}">{{item.name}}</text>
							</u-row>

						</block>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<u-modal :show="showLoading" ref="uModal"
			@close="showLoading=false;uploadErr.status = false;uploadErr.msg=null;"
			:closeOnClickOverlay="uploadErr.status" :showConfirmButton="false"
			:title="uploadErr.status?'上传错误':'上传中...'">
			<u-line-progress :percentage="percentage" activeColor="#ff0800" :showText="false"
				v-if="!uploadErr.status"></u-line-progress>
			<text v-if="uploadErr.status">错误信息：{{uploadErr.msg}}</text>
		</u-modal>
		<uv-modal ref="publish" :closeOnClickOverlay="false" :showConfirmButton="false" :show-cancel-button="false"
			width="300rpx">
			<uv-loading-icon text="发布中..." mode="circle" color="#ff0800"></uv-loading-icon>
			<view slot="confirmButton"></view>
		</uv-modal>
		<!-- 插入图片 -->
		<uv-modal ref="insertImage" :showConfirmButton="false" title="插入图片" :zIndex="100"
			@close="showInsertImage = false" :show="showInsertImage">
			<view style="display: flex;flex-direction: column;width: 100%;">
				<view>
					<u-input v-model="images" border="none"
						style="padding:15rpx;border-radius: 10rpx;background: #f7f7f7;"
						placeholder="http(s)://"></u-input>
				</view>
				<view style="margin-top: 30rpx;">
					<u-button shape="circle" color="#ff0800" @click="insertImages()">插入</u-button>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</uv-modal>
		<!-- 插入链接 -->
		<uv-modal ref="insertLink" :showConfirmButton="false" @close="showInsertLink = false" title="插入链接" :zIndex="100"
			:show="showInsertLink">
			<view style="width: 100%;display: flex;flex-direction: column;">
				<view>
					<u-input v-model="link.link" placeholder="http(s)://" border="none"
						style="padding:15rpx;border-radius: 10rpx;background: #f7f7f7;"></u-input>
				</view>
				<u-gap height="10"></u-gap>
				<u-input v-model="link.text" placeholder="链接文本" border="none"
					style="padding:15rpx;border-radius: 10rpx;background: #f7f7f7;"></u-input>
				<view style="margin-top: 30rpx;">
					<u-button shape="circle" color="#ff0800" @click="insertLink()">插入链接</u-button>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</uv-modal>

		<!-- 插入视频 -->
		<uv-modal ref="insertVideo" :showConfirmButton="false" @close="showInsertVideo = false" title="插入视频"
			:zIndex="100" :show="showInsertVideo">
			<view style="width: 100%;display: flex;flex-direction: column;">
				<view>
					<u-input v-model="video.link" placeholder="http(s)://....mp4" border="none"
						style="padding:15rpx;border-radius: 10rpx;background: #f7f7f7;"></u-input>
				</view>
				<u-gap height="10"></u-gap>
				<u-input v-model="video.poster" placeholder="封面链接" border="none"
					style="padding:15rpx;border-radius: 10rpx;background: #f7f7f7;"></u-input>
				<view style="margin-top: 30rpx;">
					<u-button shape="circle" color="#ff0800" @click="insertVideo(false)">插入视频</u-button>
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
							<view style="padding:30rpx;background:#ff08000a;border-radius: 20rpx;margin-bottom: 20rpx;"
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
		<!-- 取消任务提示 -->
		<u-popup :show="showCancelTask" :round="10" mode="center" @close="showCancelTask = false"
			customStyle="width:500rpx">
			<view
				style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
				<text style="font-size: 34rpx;">提示</text>
				<view style="margin-top:30rpx">
					<text>是否取消上传？</text>
				</view>
				<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
					<u-button plain color="#ff0800" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
						@click="showCancelTask = false">取消</u-button>
					<u-button color="#ff0800" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
						@click="cancelTask()">确定</u-button>
				</u-row>
			</view>
		</u-popup>
		<!-- actionSheet -->
		<u-action-sheet @select="selectTap" :actions="actions" :show="showAddMore" title="添加更多" closeOnClickOverlay
			@close="showAddMore = false" :closeOnClickAction="true" round="10">

		</u-action-sheet>
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
					color: ['#ff0800', '#5bd784', '#ffa600', '#0dd0f2', '#fb4f14', '#000000'],
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
				isSave: false,
				uploadTask: null,
				showCancelTask: false,
				showAddMore: false,
				showInsertLink: false,
				showInsertVideo: false,
				actions: [{
						name: '插入外部图片',
						type: 'picture'
					},
					{
						name: '插入外部视频',
						type: 'video'
					},
					{
						name: '插入链接',
						type: 'link'
					}

				],
				link: {
					link: '',
					text: '',
				},
				video: {
					link: '',
					poster: ''
				},
				saveBack: false,
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
			if (this.saveBack) {
				next();
				return;
			}
			if (this.uploadTask) {
				this.showCancelTask = true;
				this.$Router.$lockStatus = false
				return;
			}
			if (this.showInsertImage || this.showCategory || this.showDraft || this.showTag || this.showPanel || this
				.showAddMore || this.showInsertLink) {
				this.showInsertImage = false;
				this.showCategory = false;
				this.showDraft = false;
				this.showTag = false;
				this.showPanel = false;
				this.showAddMore = false;
				this.showInsertLink = false;
				this.$refs.insertImage.close();
				this.$refs.insertLink.close();
				this.$Router.$lockStatus = false
				return;
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
						page: 1,
						limit: 50,
						params: JSON.stringify({
							type: 'category'
						})
					}
				}).then(res => {

					if (res.data.code == 200) {
						for (let i in res.data.data.data) {
							if (res.data.data.data[i].mid == 1) this.article.category = res.data.data.data[i];
						}
						this.category = res.data.data.data
					}
				})
			},
			getTags() {
				this.$http.get('/category/list', {
					params: {
						page: 1,
						limit: 10,
						params: JSON.stringify({
							type: 'tag',
						}),
						order: 'count'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.tags = res.data.data.data
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
				} catch (error) {
					console.error(error); // 打印错误信息到控制台
				}
			},
			// 选择视频
			chooseVideo() {
				// 重置进度条
				this.percentage = 0;
				uni.chooseVideo({
					compressed: false,
					success: (res) => {
						this.videoPath = res.tempFilePath
					}
				})
			},
			async captureList({
				list,
				duration
			}) {
				this.videoInfo.poster = list[0]
				//开始上传
				this.showLoading = true
				let video = await this.uploadFile(this.videoPath, 'video')
				if (video) {
					this.videoInfo.url = video
					this.insertVideo(true)
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
						getTask: (task, options) => {
							this.uploadTask = task
							task.onProgressUpdate((res) => {
								this.percentage = res.progress
							})
						}
					}).then(res => {
						if (res.data.code == 200) {
							// 上传完成之后清除uploadTask;
							resolve(res.data.data.url)
						} else {
							this.uploadErr.status = true
							this.uploadErr.msg = res.data.msg
							uni.hideLoading()
						}
						this.uploadTask = null;
					}).catch(err => {
						this.uploadTask = null;
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

						if (res.data.code == 200) {
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
				if (this.isSave) return;
				if (this.article.title < 4) {
					uni.$u.toast('标题太短')
					this.isSave = false;
					return
				}
				this.isSave = true;
				this.editorCtx.getContents({
					success: res => {
						this.article.text = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `_|#${alt}|`;
							});

						if (this.article.text.length < 20) {
							uni.$u.toast('再多写点吧~');
							this.isSave = false;
							return;
						}

						this.$refs.publish.open();
						let tags = this.article.tags.map(tag => tag.mid).join(',');
						this.$http.post('/article/articleAdd', {
							title: this.article.title,
							text: this.article.text,
							category: this.article.category.mid,
							mid: this.article.category.mid,
							tag: tags,
							opt: JSON.stringify(this.article.opt),
							price: this.article.price,
							discount: this.article.discount,
						}).then(res => {
							if (res.data.code == 200) {
								this.saveBack = true
								// 关闭弹窗再弹出成功对话框
								setTimeout(() => {
									this.$refs.publish.close();
									setTimeout(() => {
										uni.$u.toast(res.data.msg)
										setTimeout(() => {
											this.$Router.back(1);
										}, 1500);
									}, 1000)
								}, 1000);
							} else {
								this.$refs.publish.close()
							}
							this.isSave = false
						}).catch(err => {
							this.isSave = false
						})
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
					extClass: 'emoji',
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
			async insertVideo(type) {
				let file;
				let poster;
				let url;
				if (type) {
					file = await this.formatImage(this.videoInfo.poster.base64);
					poster = await this.upload(file);
					url = this.videoInfo.url
				} else {
					poster = this.video.poster;
					url = this.video.link;
				}
				if (poster) {
					this.editorCtx.insertImage({
						src: poster,
						alt: `src=${url}|poster=${poster}|type=video`,
						width: '100%',
						height: '200px',
						extClass: 'imageCover',
						data: {
							type: 'video',
							poster: poster,
							src: url,
						},
						success: (res) => {
							this.editorCtx.insertText({
								text: '\n\n'
							})
							this.showLoading = false
							if (!type) {
								this.video.link = '';
								this.video.poster = ';'
							}

						}
					})
				}
			},

			formatTool(type, value) {
				this.editorCtx.format(type, value)
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
						id
					},

				}).then(res => {
					if (res.data.code == 200) {
						this.article.cid = res.data.data.cid
						this.article.title = res.data.data.title
						this.article.text = res.data.data.text
						this.article.category = res.data.data.category ? res.data.data.category : this.category[0]
						this.article.tags = res.data.data.tag
						this.article.mid = res.data.data.mid
						this.article.opt = res.data.data.opt
						this.article.price = res.data.data.price
						this.article.discount = res.data.data.discount

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
						this.$http.post('/article/update', {
							id: this.article.cid,
							title: this.article.title,
							text: this.article.text,
							category: this.article.category.mid ? this.article.category
								.mid : this.article.category[0].mid,
							mid: this.article.category.mid ? this.article.category.mid : this.article
								.category[0].mid,
							tag: tags,
							price: this.article.price,
							discount: this.article.discount,
							opt: JSON.stringify(this.article.opt)
						}).then(res => {
							if (res.data.code == 200) {
								this.saveBack = true
								setTimeout(() => {
									this.$Router.back(1)
								}, 1000)
							}
							uni.$u.toast(res.data.msg)
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
			insertLink() {
				if (!this.link.link) {
					uni.$u.toast('链接不可为空')
					return;
				}
				this.editorCtx.getContents({
					success: (res) => {
						let html = res.html;
						html +=
							`<a href='${this.link.link}'>${this.link.text?this.link.text:this.link.link}</a>`;
						this.editorCtx.setContents({
							html,
							success: () => {
								this.link.link = '';
								this.link.text = '';
								this.showInsertLink = false;
								this.$refs.insertLink.close();
							}
						})
					}
				})

			},
			insertDraft(data) {
				this.article = data
				this.draftId = data.draftId
				this.editorCtx.setContents({
					html: this.article.text,
					success: (res) => {
						this.showDraft = false

					}
				})
			},
			// 取消上传请求
			cancelTask() {
				if (this.uploadTask) {
					this.uploadTask.abort()
					this.uploadTask = null;
					this.showCancelTask = false;
					this.uploadErr.msg = '取消上传'
					this.uploadErr.status = true
				}
			},
			selectTap(object) {
				switch (object.type) {
					case 'picture':
						this.showInsertImage = true;
						this.$refs.insertImage.open();
						break;
					case 'link':
						this.showInsertLink = true;
						this.$refs.insertLink.open()
						break;
					case 'video':
						this.showInsertVideo = true;
						this.$refs.insertVideo.open();
					default:
						break;
				}
			}

		}
	}
</script>
<script module="capture" lang="renderjs">
	export default {
		methods: {
			async captures(videoPath) {
				let duration = await this.getDuration(videoPath)
				let frameTime = duration > 5000 ? 5000 : 2000 // 判断视频时长是否大于5秒，选择截取时刻
				const frame = await this.captureFrame(videoPath, frameTime / 1000)
				let list = [frame]

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
	.ql-container ::v-deep .ql-blank::before {
		font-style: normal;
		color: #999;
		min-height: 0rpx;
	}

	.mgc_download_2_line:before {
		content: "\e685";
	}

	.ql-container ::v-deep a {
		text-decoration: none;
		color: $c-primary;

		&::before {
			content: '🔗';
			margin-right: 5rpx;
		}
	}


	.ql-container ::v-deep img {
		margin: 20rpx auto;
		border-radius: 20rpx;
		width: 80%;
		display: block;
	}

	.ql-container ::v-deep img.emoji {
		display: inline-block;
		width: 50px;
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

	.button-color {
		color: $c-primary;
		transition: all 0.5s ease-out;
	}

	.showPanel {
		transition: all 0.5s ease-out;
	}
</style>