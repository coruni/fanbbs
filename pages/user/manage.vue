<template>
	<view>
		<u-navbar placeholder title="管理面板" autoBack></u-navbar>
		<view style="margin: 30rpx;">
			<u-grid customStyle="background:#85a3ff0a;padding:30rpx;border-radius:20rpx">
				<u-grid-item v-for="(item,index) in data" :key="index">
					<view style="display: flex; flex-direction: column;align-items: center;margin-bottom: 20rpx;">
						<text>{{item.count}}</text>
						<text>{{item.name}}</text>
					</view>
				</u-grid-item>
			</u-grid>

			<view style="margin-top: 20rpx;">
				<u-row justify="space-between">
					<view>
						<text>板块列表</text>
					</view>
					<view>
						<u-button size="mini" color="#a899e6" plain shape="circle"
							@click="$refs.editCategory.open()">创建板块</u-button>
					</view>
				</u-row>
				<scroll-view style="height: 400rpx;overflow: hidden;" scroll-y>
					<block v-for="(item,index) in category" :key="index">
						<u-row customStyle="margin-top:20rpx" justify="space-between">
							<view style="display: flex;">
								<u-avatar shape="square" :src="item.imgurl"></u-avatar>
								<view style="display: flex;flex-direction: column;margin-left: 20rpx;">
									<text>{{item.name}}</text>
									<text style="font-size: 26rpx;" class="u-line-1">{{item.description}}</text>
								</view>
							</view>
							<view>
								<u-button plain color="#a899e6" size="mini"
									@click="$refs.editCategory.open();editCategory = item">编辑</u-button>
							</view>
						</u-row>
					</block>
				</scroll-view>
			</view>
		</view>

		<uv-modal ref="editCategory" :showConfirmButton="false" title="编辑分类" :zIndex="20">
			<view style="width: 100%;">
				<u-row justify="space-between">
					<u-avatar :src="editCategory.imgurl" shape="square" size="50" @click="choose(true)"></u-avatar>
					<image mode="aspectFill" :src="editCategory.opt && editCategory.opt.background"
						@click="choose(false)"
						style="border-radius: 10rpx;width: 100%;height: 100rpx;margin-left: 50rpx;background: #f7f7f7;">
					</image>
				</u-row>
				<view style="margin-top: 20rpx;">
					<text style="color: #999;">名称</text>
					<u-input v-model="editCategory.name" maxlength="20" placeholder="分类名称" border="bottom"
						customStyle="padding: 10rpx 0;" />
					<u-gap height="10"></u-gap>
					<text style="color: #999;">简介</text>
					<u-input v-model="editCategory.description" maxlength="120" placeholder="分类介绍" border="bottom"
						customStyle="padding: 10rpx 0;" />
					<u-gap height="10"></u-gap>
					<view style="background: #85a3ff0a;padding: 30rpx;border-radius: 20rpx;">
						<text style="color: #999;">主题色</text>
						<u-input v-model="editCategory.opt && editCategory.opt.primary" placeholder="#a899e6"
							border="bottom" customStyle="padding: 10rpx 0;" />
						<u-gap height="10"></u-gap>
						<text style="color: #999;">下划线颜色</text>
						<u-input v-model="editCategory.opt && editCategory.opt.underline" placeholder="#a899e6"
							border="bottom" customStyle="padding: 10rpx 0;" />
						<u-gap height="10"></u-gap>
						<text style="color: #999;">字体颜色</text>
						<u-input v-model="editCategory.opt && editCategory.opt.color" placeholder="#a899e6"
							border="bottom" customStyle="padding: 10rpx 0;" />
					</view>
				</view>
				<u-button color="#a899e6" shape="circle" customStyle="margin-top: 30rpx;"
					@click="editCategory.mid?saveCategory(false):addCategory()">保存</u-button>
			</view>
			<view slot="confirmButton"></view>

		</uv-modal>
		<l-clipper v-if="backgroundShow" :image-url="cropperBg"
			@success="upload($event.url,false); backgroundShow = false" @cancel="backgroundShow = false" is-limit-move
			is-lock-ratio :width="1280" :height="720" :min-width="1280" :min-height="720" :max-width="1920"
			:max-height="720" />

		<l-clipper v-if="showClipper" :imageUrl="avatarImage"
			@success="upload($event.url,true);showClipper=false;showLoading=true" @canel="showClipper = false"
			is-limit-move is-lock-ratio />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: [],
				category: [],
				editCategory: {
					name: null,
					imgurl: null,
					description: null,
					opt: {}
				},
				showEditCategory: false,
				avatarImage: null,
				cropperBg: null,
				backgroundShow: false,
				showClipper: false,
			};
		},
		created() {
			this.initData()
			this.getCategory()
		},
		methods: {
			initData() {
				this.getAllData()
			},
			getAllData() {
				this.$http.post('/typechoContents/allData').then(res => {
					if (res.data.code) {
						let data = res.data.data
						this.data = [{
							name: '广告数',
							count: data.allAds
						}, {
							name: '评论数',
							count: data.allComments
						}, {
							name: '帖子数',
							count: data.allContents
						}, {
							name: '商品',
							count: data.allShop
						}, {
							name: '动态',
							count: data.allSpace
						}, {
							name: '用户',
							count: data.allUsers
						}]
					}
				})
			},
			getCategory() {
				this.$http.get('/typechoMetas/metasList', {
					page: 1,
					limit: 30,
					params: {
						searchParams: JSON.stringify({
							type: 'category'
						})
					}
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						let list = [];
						for (let item of res.data.data) {
							item.opt = JSON.parse(item.opt);
							list.push(item);
						}
						this.category = list;
					}
				})
			},
			saveCategory(upload) {
				this.$http.post('/typechoMetas/editMeta', {
					params: JSON.stringify({
						mid: this.editCategory.mid ? this.editCategory.mid : '',
						imgurl: this.editCategory.imgurl,
						name: this.editCategory.name,
						description: this.editCategory.description,
						opt: JSON.stringify(this.editCategory.opt)
					})
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						uni.$u.toast('保存成功')
						if (!upload) {
							setTimeout(() => {
								this.$refs.editCategory.close()
								this.editCategory = {
									name: null,
									imgurl: null,
									description: null,
									opt: {}
								}
							}, 500)
						}
					}
				})
			},
			addCategory() {
				this.$http.post('/typechoMetas/addMeta', {
					params: JSON.stringify({
						imgurl: this.editCategory.imgurl,
						name: this.editCategory.name,
						type: 'category',
						description: this.editCategory.description,
						opt: JSON.stringify(this.editCategory.opt)
					})
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						uni.$u.toast('创建成功')
						setTimeout(() => {
							this.getCategory()
							this.$refs.editCategory.close()
							this.editCategory = {
								name: null,
								imgurl: null,
								description: null,
								opt: {}
							}
						}, 500)
					}
				})
			},
			choose(isAvatar) {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					success: (res) => {
						if (isAvatar) {
							this.avatarImage = res.tempFilePaths[0];
							this.showClipper = true
						} else {
							this.cropperBg = res.tempFilePaths[0];
							this.backgroundShow = true
						}

					}
				})
			},
			upload(url, isAvatar) {
				this.$http.upload('/upload/full', {
					filePath: url,
					name: 'file'
				}).then(res => {
					console.log(res)
					if (res.data.code) {
						if (isAvatar) this.editCategory.imgurl = res.data.data.url;
						else this.editCategory.opt.background = res.data.data.url;
					}
				})
			},
		}
	}
</script>

<style lang="scss">

</style>