<template>
	<view>
		<uv-navbar autoBack placeholder rightText="">
			<view slot="right">
				<u-button :color="article.category.mid&&article.title?'#85a3ff':'#e6e6e6'" shape="circle"
					customStyle="width:150rpx;height:50rpx"
					@click="article.category.mid&&article.title?save():$u.toast('要选择正确的板块哦~')">发布</u-button>
			</view>
		</uv-navbar>
		<view style="padding: 30rpx;" id="image">
			<u-row @click="showCategory = true"
				style="background: #f7f7f7;padding: 8rpx 16rpx;width: 260rpx;border-radius: 20rpx;margin-bottom: 20rpx;"
				justify="space-between">
				<u-row align="center">
					<u-avatar customStyle="margin-right:10rpx" :src="article.category.imgurl"
						v-if="article.category.imgurl" size="20"></u-avatar>
					<text>{{article.category.name?article.category.name:'选择板块'}}</text>
				</u-row>
				<u-icon name="arrow-right"></u-icon>
			</u-row>
			<uv-scroll-list :indicator="false">
				<u-upload :fileList="images" @afterRead="afterRead" @delete="deletePic" name="photo" multiple
					:maxCount="9" width="100" height="100" customStyle="flex-wrap:nowrap"></u-upload>
			</uv-scroll-list>
		</view>
		<view style="padding: 30rpx;" id="input">
			<u-input maxlength="30" :adjustPosition="false" border="bottom" v-model="article.title"
				placeholder="请输入标题(必须)" placeholderStyle="font-size:40rpx" font-size="20"
				customStyle="padding: 0;"></u-input>
		</view>
		<view style="padding: 20rpx 30rpx 30rpx 30rpx;">
			<editor id="editor" :adjust-position="false" placeholder="请输入内容" @ready="onEditorReady"
				:style="`height:${windowHeight}px`"></editor>
		</view>
		<uv-modal ref="publish" :closeOnClickOverlay="false" :showConfirmButton="false" :show-cancel-button="false"
			width="300rpx">
			<uv-loading-icon text="发布中..." mode="circle" color="#85a3ff"></uv-loading-icon>
			<view slot="confirmButton"></view>
		</uv-modal>
		<u-popup customStyle="border-radius:40rpx 40rpx 0 0" :show="showCategory" @close="showCategory = false"
			:closeable="true">

			<view style="height: 70vh;padding:30rpx">
				<view style="text-align: center;">选择板块</view>
				<view style="margin-top: 30rpx;">
					<u-grid :border="false" col="3">
						<u-grid-item v-for="(item,index) in category" :key="index"
							@click="article.category = item;showCategory=false"
							:style="`background:${item.opt && item.opt.primary};border-radius:20rpx;height:200rpx;width:200rpx`">
							<view
								style="display: flex; flex-direction: column; justify-content: center;align-items: center;">
								<image :src="item.imgurl"
									style="width: 100rpx;height: 100rpx;border-radius: 20rpx;background: #f7f7f7;"
									mode="aspectFill"></image>
								<view style="margin-top: 20rpx;font-size: 30rpx;">
									<text>{{item.name}}</text>
								</view>
							</view>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				images: [],
				showCategory: false,
				category: [],
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

			}
		},
		created() {
			this.initData()
		},
		onReady() {
			let height = 0;
			uni.createSelectorQuery().in(this).select("#image").boundingClientRect(data => {
				height = data.height
			}).exec()
			uni.createSelectorQuery().in(this).select("#input").boundingClientRect(data => {
				height += data.height
				console.log(height)
			}).exec()
			let systemInfo = uni.getSystemInfoSync()
			this.windowHeight = systemInfo.windowHeight - systemInfo.statusBarHeight - 152 - 59 - 100
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
					console.log(res)
					if (res.data.code) {
						let data = res.data.data;
						for (let i in res.data.data) {
							if (res.data.data[i].mid == 1) this.article.category = res.data.data[i];
						}
						this.category = data
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

					if (res.data.code) {
						this.tags = res.data.data

					}
				})
			},
			deletePic(event) {
				this.images.splice(event.index, 1)
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
				if (this.article.title < 4) {
					uni.$u.toast('标题太短')
					return
				}
				this.editorCtx.getContents({
					success: res => {
						this.article.text = res.text
						if (res.text.length < 4) {
							uni.$u.toast('再多说点什么吧~')
							return
						}
						this.$refs.publish.open()
						let tags = this.article.tags.map(tag => tag.mid).join(',')
						let images = this.images.map(file => file.url);
						this.$http.post('/typechoContents/contentsAdd', {
							params: JSON.stringify({
								title: this.article.title,
								text: this.article.text,
								category: this.article.category.mid,
								mid: this.article.category.mid,
								tag: tags,
								type: 'photo',
								opt: JSON.stringify(this.article.opt),
								images: images
							}),
							text: this.article.text,
						}).then(res => {
							if (res.data.code) {
								setTimeout(() => {
									this.$refs.publish.close()
									uni.$u.toast(res.data.msg)
									setTimeout(() => {
										this.$Router.back(1)
									}, 800)
								}, 1500)
							} else {
								uni.$u.toast(res.data.msg)
								this.$refs.publish.close()
							}
						})
					}
				})

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
		}
	}
</script>

<style lang="scss">
	/deep/ .u-upload__wrap {
		flex-wrap: nowrap;
	}

	.ql-container ::v-deep .ql-blank::before {
		/* 此处设置 placeholder 样式 */
		font-style: normal;
		text-decoration: unset;
	}
</style>