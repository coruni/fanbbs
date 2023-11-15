<template>
	<view>
		<u-navbar autoBack placeholder id="navbar">
			<view slot="center">
				<text>发布帖子</text>
			</view>
			<template #right>
				<u-button plain color="#a899e6" size="mini" customStyle="font-size:30rpx">草稿箱</u-button>
				<u-button plain color="#a899e6" size="mini" customStyle="font-size:30rpx" @click="save()">发布</u-button>
			</template>

		</u-navbar>
		<view style="padding:20rpx 30rpx 0rpx 30rpx;" id="inputTitle">
			<u-input v-model="article.title" placeholder="标题 (必填)" border="none"
				customStyle="padding-bottom:10rpx;border-bottom:2rpx solid #f1f1f1"></u-input>
		</view>
		<editor :adjust-position="false" placeholder="灵感迸发" id="editor" @ready="onEditorReady"
			style="width: 100%;padding:10rpx 30rpx 0rpx 30rpx;"
			:style="{height:editorHeight - keyboardHeight - toolbarHeight-2 +'px'}" focus >
		</editor>
		<view id="toolbar" style="background: #fff;padding: 10rpx 30rpx; 0rpx 30rpx">
			<u-row justify="space-between" @click="showCategory = true">
				<text>选择发布位置</text>
				<u-row><text>{{article.category.name}}</text>
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
						<u-icon name="photo" size="24" @click="chooseImage()"></u-icon>
						<u-icon name="heart" size="24"></u-icon>
						<u-icon name="arrow-up-fill" size="24"></u-icon>
						<u-icon name="play-circle" size="24"></u-icon>
						<u-icon name="plus-circle" size="24"></u-icon>
					</u-row>
					<view style="margin-left: 140rpx;">
						<u-icon name="setting-fill" size="20" color="#a899e6"
							customStyle="background:#a899e664;border-radius:50rpx;padding:10rpx;box-shadow: 0 0 9rpx #a899e6"></u-icon>
					</view>
				</u-row>
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
							<u-row @click="article.category = item;showCategory = false">
								<text v-if="item.isrecommend" style="
									font-size: 26rpx;
									color:#a899e6;
									background: #a899e63c;
									padding:4rpx 14rpx;
									border-radius: 10rpx;">推荐</text>
								<text style="margin-left: 20rpx;"
									:style="{color:article.category && article.category.mid == item.mid?'#a899e6':''}">{{item.name}}</text>
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
									:style="{color:article.tags.some(tag=>tag.mid == item.mid)?'#a899e6':''}">{{item.name}}</text>
							</view>
						</block>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<u-modal :show="showLoading" ref="uModal" :showConfirmButton="false" title="上传中...">
			<u-line-progress :percentage="percentage" activeColor="#a899e6" :showText="false"></u-line-progress>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				percentage: 30,
				showLoading: false,
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
					text: null,
					category: {
						mid: 1
					},
					tags: [],
					opt: {
						files: [],
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
		created() {
			this.initData()
		},
		methods: {
			initData() {
				this.getCategory()
				this.getTags()
			},

			getCategory() {
				this.$http.get('/typechoMetas/metasList', {
					params: {
						searchParams: JSON.stringify({
							type: 'category',

						}),
					}
				}).then(res => {
					if (res.data.code) {
						console.log(res)
						for (let i in res.data.data) {
							if (res.data.data[i].mid == 1) this.article.category = res.data.data[i];
						}
						this.category = res.data.data
					}
				})
			},
			getTags() {
				this.$http.get('/typechoMetas/metasList', {
					params: {
						searchParams: JSON.stringify({
							type: 'tag',
						}),
						order: 'count'
					}
				}).then(res => {
					console.log(res)
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
				// 重置进度条
				this.percentage = 30;
				try {
					const res = await uni.chooseImage({
						count: 20
					});
					let loading = 100 / res.tempFilePaths.length - this.percentage
					let count = res.tempFilePaths.length
					this.showLoading = true
					for (let i in res.tempFilePaths) {
						let image = await this.upload(res.tempFilePaths[i]);
						count -= 1
						this.percentage += loading
						this.editorCtx.insertImage({
							src: image,
							alt: this.article.title ? this.article.title : 'Chikata'
						});
					}
					if (!count) {
						setTimeout(() => {
							this.showLoading = false;
							
						}, 200)

					}
					// 图片插入完成插入换行
					this.editorCtx.insertText({
						text: '\n'
					});
				} catch (error) {

				}
			},
			upload(image) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath: image,
						name: 'file',
					}).then(res => {
						if (res.data.code) {
							resolve(res.data.data.url)
						}
					}).catch(err => {
						console.log(err)
					})

				})
			},
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