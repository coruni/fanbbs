<template>
	<z-paging-swiper>
		<swiper style="height: 100%;">
			<swiper-item v-show="!loading">
				<z-paging ref="paging" v-model="comments" @query="getComments">
					<template #top>
						<u-navbar placeholder autoBack @rightClick="showMore = true" fixed>
							<view slot="right">
								<u-icon name="more-dot-fill"></u-icon>
							</view>
						</u-navbar>
					</template>
					<view style="margin: 10rpx 20rpx 20rpx 20rpx;" v-if="article">
						<articleHeader :data="author"></articleHeader>
						<articleContent :data="article"></articleContent>
						<articleFooter :data="article"></articleFooter>
					</view>
					<!-- 评论区 -->
					<u-gap height="10" bgColor="#f7f8f7"></u-gap>
					<view style="margin: 20rpx;">
						<u-tabs :list="commentTab" :curren="commentTabIndex" lineColor="#FB7299"
							:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
							:inactiveStyle="{color: '#606266',transform: 'scale(1)'}"
							:itemStyle="{fontSize:'16rpx',height:'30px'}" lineHeight="3"></u-tabs>
						<!-- 开始 -->
						<block v-for="(item,index) in comments" v-if="comments">
							<view style="margin-top:10rpx">
								<comment :data="item"></comment>
							</view>
						</block>
					</view>

					<template #bottom>
						<u-row customStyle="margin:20rpx" justify="space-between">
							<u-col span="6">
								<u-row customStyle="padding:14rpx 14rpx;border-radius: 50rpx;"
									class="u-info-light-bg u-info" @click="showComment = true">
									<u-icon name="edit-pen" size="20"></u-icon>
									<text style="margin-left:10rpx;font-size: 28rpx;">说点什么</text>
								</u-row>
							</u-col>
							<u-col span="5">
								<u-row customStyle="margin-left:20rpx;flex:1" justify="space-around">
									<view style="display: flex; flex-direction: column;align-items: center;">
										<u-icon name="rmb-circle" size="18"></u-icon>
										<u-text text="发电" size="12"></u-text>
									</view>
									<view style="display: flex; flex-direction: column;align-items: center;">
										<u-icon name="star" size="20"></u-icon>
										<u-text text="收藏" size="12"></u-text>
									</view>

									<view style="display: flex; flex-direction: column;align-items: center;">
										<u-icon name="thumb-up" size="20"></u-icon>
										<u-text text="点赞" size="12"></u-text>
									</view>
								</u-row>
							</u-col>
						</u-row>
					</template>
				</z-paging>

			</swiper-item>
			<swiper-item></swiper-item>
		</swiper>
		<u-loading-page :loading="loading"></u-loading-page>
		<!-- 页面公用组件 -->
		<!-- 回复文章 -->
		<u-popup :show="showComment" @close="showComment = false" round="20" :customStyle="{paddingBottom:keyboardHeight+'px',padding:30+'rpx'}">
			<u--textarea :adjustPosition="false" :cursorSpacing="40" type="textarea" v-model="commentText"
				placeholder="灵感迸发" border="none"
				customStyle="background:#f7f8f7;padding:4rpx 10rpx;border-radius:20rpx"></u--textarea>
			<u-row customStyle="margin-top:10rpx" justify="space-between">
				<u-col span="6">
					<u-row justify="space-between">
						<block v-for="(item,index) in cBtn" :key="index">
							<u-icon :name="item.icon" size="20" @click="cBtnTap(item.name)"></u-icon>
						</block>
					</u-row>
				</u-col>
				<view>
					<u-button shape="circle" color="#FB7299" customStyle="padding:4rpx,6rpx" size="mini" text="发送"
						@click="reply"></u-button>
				</view>
			</u-row>
			<!-- 隐藏面板 -->
			<block v-if="showComemntBtn == '表情'">
				<!-- 这里加表情 -->
				<!-- ui -->
				表情
			</block>
		</u-popup>
		<!-- 分享&&管理弹窗 -->
		<u-popup :show="showMore" @close="showMore = false" customStyle="padding:30rpx" round="20">
			<u-row justify="space-between" style="border-bottom:1px solid #f7f8f7;padding-bottom: 30rpx;">
				<u-col span="2" v-for="(item,index) in share" :key="index" align="center"
					customStyle="flex-direction:column" @click="shareTap">
					<view :style="{background:item.color,borderRadius:'50rpx',padding:'20rpx'}">
						<u-icon :name="item.icon" color="white" size="26"></u-icon>
					</view>
					<text style="margin-top:10rpx">{{item.name}}</text>
				</u-col>
			</u-row>
			<u-row customStyle="margin-top:30rpx">
				<u-col span="2" v-for="(item,manageIndex) in manage" :key="manageIndex" align="center"
					customStyle="flex-direction:column" @click="manageTap">
					<view :style="{borderRadius:'50rpx',padding:'20rpx'}" class="u-info-light-bg">
						<u-icon :name="item.icon" size="26"></u-icon>
					</view>
					<text style="margin-top:10rpx">{{item.name}}</text>
				</u-col>
			</u-row>
		</u-popup>
	</z-paging-swiper>
</template>

<script>
	import articleHeader from '@/pages/article/components/header.vue';
	import articleContent from '@/pages/article/components/content.vue';
	import articleFooter from '@/pages/article/components/footer.vue';
	import comment from '@/pages/article/components/comments/comment.vue';

	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter,
			comment,
		},
		data() {
			return {
				cid: 0,
				article: null,
				comments: [],
				author: null,
				loading: true,
				showMore: false,
				showComment: false,
				showComemntBtn: null,
				commentText: '',
				commentTabIndex: 0,
				commentTab: [{
					name: '全部评论',
				}, {
					name: '只看楼主'
				}],
				cBtn: [{
					name: '表情',
					icon: 'heart',
				}],
				share: [{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					},
					{
						name: '微信',
						icon: 'weixin-fill',
						color: 'green'
					}
				],
				manage: [{
						name: '举报',
						icon: 'warning'
					},
					{
						name: '编辑',
						icon: 'warning'
					}
				],
				keyboardHeight: 0,
			};
		},
		onLoad(params) {
			// GetStorage 获取存储本地的文章简略信息
			this.cid = params.id
			this.author = uni.getStorageSync(`article_${params.id}`)
			this.getData(params.id)
			setTimeout(() => {
				this.loading = false
			}, 700)
		},
		beforeCreate() {

		},

		created() {
			uni.onKeyboardHeightChange(data => {
				console.log(data)
				this.keyboardHeight =data.height
			})
		},
		methods: {
			shareTap(index) {
				console.log(index)
			},
			getData(id) {
				this.$http.get('/typechoContents/contentsInfo', {
					params: {
						key: id,
						isMd: 1
					}
				}).then(res => {
					if (res.statusCode == 200) {
						this.article = res.data
						console.log(res.data)
					}
				})
			},
			cBtnTap(name) {
				if (name == this.showComemntBtn) this.showComemntBtn = null;
				else this.showComemntBtn = name
				console.log(name)
			},
			getComments(page, limit) {
				this.$http.get('/typechoComments/commentsList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: 'comment',
							cid: this.cid
						})
					}
				}).then(res => {
					if (res.statusCode == 200) {
						console.log(res.data.data)
						this.$refs.paging.complete(res.data.data)


					}
				})
			},
			reply(pid) {
				if (this.commentText.length <= 0) return;
				let params = JSON.stringify(params = {
					cid: this.cid,
					ownerId: this.article.authorId,
					parent: pid ? pid : 0,
					text: this.commentText
				})
				this.$http.post('/typechoComments/commentsAdd', {
					params
				}).then(res => {
					console.log(res)
				})
			},
			manageTap() {

			},
		}
	}
</script>

<style lang="scss">

</style>